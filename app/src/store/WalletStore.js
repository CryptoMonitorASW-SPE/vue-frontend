import { defineStore } from 'pinia'
import axios from 'axios'
import { useCryptoStore } from './CryptoStore'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: {
      id: '',
      transactions: []
    },
    computedInvestedValue: 0,
    computedPerformanceHistory: [],
    loading: false,
    error: null
  }),

  getters: {
    investedValue: state => state.computedInvestedValue,
    performanceHistory: state => state.computedPerformanceHistory,

    currentValue() {
      const cryptoStore = useCryptoStore()
      const netHoldings = {}
      this.wallet.transactions.forEach(t => {
        if (!netHoldings[t.cryptoId]) netHoldings[t.cryptoId] = 0
        netHoldings[t.cryptoId] += t.type === 'BUY' ? t.quantity : -t.quantity
      })
      let totalValue = 0
      Object.entries(netHoldings).forEach(([txCryptoId, quantity]) => {
        const searchKey = txCryptoId.toLowerCase()
        const crypto = cryptoStore.cryptocurrencies.find(
          c => c.id.toLowerCase() === searchKey || c.symbol.toLowerCase() === searchKey
        )
        if (crypto) totalValue += quantity * (crypto.price || 0)
      })
      return totalValue
    },

    cryptoDistribution() {
      const distribution = {}
      this.wallet.transactions.forEach(t => {
        const current = distribution[t.cryptoId] || 0
        distribution[t.cryptoId] = t.type === 'BUY' ? current + t.quantity : current - t.quantity
      })
      return Object.entries(distribution)
        .filter(([, qty]) => qty > 0)
        .map(([crypto, quantity]) => ({ crypto, quantity }))
    }
  },

  actions: {
    async fetchWallet() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/management/wallet', { withCredentials: true })
        this.wallet = {
          id: response.data.id,
          transactions: (response.data.transactions || []).map(t => ({
            id: t.transactionId,
            cryptoId: t.cryptoId,
            quantity: Number(t.quantity),
            type: t.type,
            doneAt: t.doneAt,
            priceAtPurchase: Number(t.priceAtPurchase),
            currency: t.currency
          }))
        }
        console.log('Transactions to send to worker:', this.wallet.transactions)

        const worker = new Worker(new URL('../worker/WalletWorker.js', import.meta.url), {
          type: 'module'
        })

        worker.onerror = err => console.error('Worker error:', err)
        const plainTransactions = JSON.parse(JSON.stringify(this.wallet.transactions))
        worker.postMessage({ transactions: plainTransactions })

        worker.onmessage = e => {
          const { investedValue, performanceHistory } = e.data
          this.computedInvestedValue = investedValue
          this.computedPerformanceHistory = performanceHistory
          worker.terminate()
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error loading wallet'
      } finally {
        this.loading = false
      }
    },

    async addTransaction(transaction) {
      this.loading = true
      this.error = null
      try {
        await axios.post('/api/management/wallet/transaction', transaction, {
          withCredentials: true
        })
        await this.fetchWallet()
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Error adding transaction'
        return false
      } finally {
        this.loading = false
      }
    },

    async removeTransaction(transactionId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/api/management/wallet/transaction/${transactionId}`, {
          withCredentials: true
        })
        await this.fetchWallet()
      } catch (error) {
        console.log('Error:', error)
        this.error = error.response?.data?.message || 'Error removing transaction'
      } finally {
        this.loading = false
      }
    },

    async generatePdfReport() {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      // Header
      doc.setFontSize(18)
      doc.text('Wallet Report', 15, 15)
      doc.setFontSize(12)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 22)

      // Wallet Summary Section
      doc.text(`Wallet ID: ${this.wallet.id}`, 15, 30)
      doc.text(`Invested Value: ${this.formatCurrency(this.investedValue)}`, 15, 37)
      doc.text(`Current Value: ${this.formatCurrency(this.currentValue)}`, 15, 44)
      doc.text(`Total Transactions: ${this.wallet.transactions.length}`, 15, 51)

      // Crypto Distribution Summary (simplified here)
      const distribution = this.cryptoDistribution
      let yPosition = 60
      doc.setFontSize(14)
      doc.text('Crypto Distribution:', 15, yPosition)
      doc.setFontSize(12)
      yPosition += 7
      if (distribution.length === 0) {
        doc.text('No active crypto holdings.', 15, yPosition)
        yPosition += 7
      } else {
        distribution.forEach(item => {
          doc.text(`${item.crypto}: ${item.quantity}`, 15, yPosition)
          yPosition += 7
        })
      }

      // Transactions Table (using autoTable)
      const columns = [
        { header: 'Date', dataKey: 'date' },
        { header: 'Crypto ID', dataKey: 'cryptoId' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Price', dataKey: 'priceAtPurchase' },
        { header: 'Currency', dataKey: 'currency' }
      ]

      const rows = this.wallet.transactions.map(t => {
        return {
          date: new Date(t.doneAt).toLocaleDateString(),
          cryptoId: t.cryptoId,
          type: t.type,
          quantity: t.quantity.toFixed(4),
          priceAtPurchase: t.priceAtPurchase.toFixed(2),
          currency: t.currency
        }
      })

      const autoTable = (await import('jspdf-autotable')).default
      autoTable(doc, {
        startY: yPosition + 10,
        head: [columns.map(c => c.header)],
        body: rows.map(row => columns.map(c => row[c.dataKey])),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      })

      doc.save('wallet-report.pdf')
    },

    formatCurrency(value) {
      const cryptoStore = useCryptoStore()
      const currencyCode = cryptoStore.selectedCurrency || 'USD'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode
      }).format(value)
    }
  }
})
