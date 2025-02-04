import { defineStore } from 'pinia'
import axios from 'axios'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: {
      id: '',
      transactions: []
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchWallet() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/management/wallet', {}, { withCredentials: true })
        console.error(response)
        if (response.data) {
          this.wallet.id = response.data.id
          this.wallet.transactions = (response.data.transactions || []).map(t => ({
            id: t.transactionId,
            cryptoId: t.cryptoId,
            quantity: t.quantity,
            type: t.type === 'BUY' ? 'BUY' : 'SELL',
            doneAt: t.doneAt,
            priceAtPurchase: t.priceAtPurchase
          }))
          // Calcola il balance
          this.wallet.balance = this.wallet.transactions.reduce((acc, t) => {
            const amount = t.quantity * t.priceAtPurchase
            return t.type === 'BUY' ? acc + amount : acc - amount
          }, 0)
        } else {
          this.wallet = { id: '', transactions: [], balance: 0 }
        }
      } catch (error) {
        this.error = 'Errore nel caricamento del wallet'
        console.error(error)
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
      } catch (error) {
        this.error = "Errore nell'aggiunta della transazione"
        console.error(error)
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
        this.error = 'Errore nella rimozione della transazione'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  },
  persist: true
})
