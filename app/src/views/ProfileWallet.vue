<!-- filepath: /src/views/ProfileWallet.vue -->
<template>
  <div class="wallet-view container px-2 my-4">
    <!-- Header Section -->
    <header class="wallet-header py-3">
      <div class="header-top d-flex flex-wrap justify-content-between align-items-center">
        <h1 class="page-title h3 mb-0">Crypto Wallet</h1>
        <div class="header-controls">
          <button
            class="download-button btn btn-primary d-flex align-items-center"
            aria-label="Download wallet report"
            @click="walletStore.generatePdfReport"
          >
            <i class="bi bi-download me-2" aria-hidden="true"></i>
            <span class="text">Download PDF</span>
          </button>
        </div>
      </div>

      <div class="balance-cards row g-3 mt-3">
        <div class="balance-card col-12 col-md-6">
          <div class="card p-3">
            <h2 class="h6">Invested Value</h2>
            <p class="mb-0 fw-bold">{{ walletStore.formatCurrency(walletStore.investedValue) }}</p>
          </div>
        </div>
        <div class="balance-card col-12 col-md-6">
          <div class="card p-3 border-start border-3 border-primary">
            <h2 class="h6">Current Value</h2>
            <p class="mb-0 fw-bold">{{ walletStore.formatCurrency(walletStore.currentValue) }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Charts Section -->
    <section class="charts-section mt-4">
      <div class="chart-card card p-3 mb-3">
        <h2 class="chart-title h6">Asset Allocation</h2>
        <!-- Pass cryptoDistribution that now uses cryptoId for the chart labels -->
        <WalletPieChart :data="walletStore.cryptoDistribution" />
      </div>

      <div class="chart-card card p-3 mb-3">
        <h2 class="chart-title h6">Performance History</h2>
        <WalletPerformanceChart
          :history="walletStore.performanceHistory"
          :currentValue="walletStore.currentValue"
        />
      </div>
    </section>

    <!-- Transactions Section -->
    <section class="transactions-section mt-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h5 m-0">Transactions</h2>
        <button class="btn btn-primary" @click="openTransactionModal">+ Add Transaction</button>
      </div>
      <TransactionModal :isVisible="isTransactionModalVisible" @close="closeTransactionModal" />
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Crypto ID</th>
              <th scope="col">Quantity</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in walletStore.wallet?.transactions || []"
              :key="transaction.id"
            >
              <th scope="row">{{ index + 1 }}</th>
              <!-- Display cryptoId rather than crypto name -->
              <td>{{ transaction.cryptoId }}</td>
              <td>{{ transaction.quantity }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': transaction.type === 'BUY',
                    'bg-danger': transaction.type === 'SELL'
                  }"
                >
                  {{ transaction.type }}
                </span>
              </td>
              <td>{{ formatDate(transaction.doneAt) }}</td>
              <td>
                ${{
                  transaction.priceAtPurchase != null
                    ? transaction.priceAtPurchase.toFixed(2)
                    : '0.00'
                }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  aria-label="Delete transaction"
                  @click="confirmDeleteTransaction(transaction.id)"
                >
                  <i class="bi bi-trash3-fill" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
            <tr
              v-if="!(walletStore.wallet?.transactions && walletStore.wallet.transactions.length)"
            >
              <td colspan="7" class="text-center">No transactions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '@/stores/WalletStore'
import TransactionModal from '@/components/modals/TransactionModal.vue'
import WalletPieChart from '@/components/wallet/WalletPieChart.vue'
import WalletPerformanceChart from '@/components/wallet/WalletPerformanceChart.vue'

export default {
  name: 'ProfileWallet',
  components: {
    TransactionModal,
    WalletPieChart,
    WalletPerformanceChart
  },
  setup() {
    const walletStore = useWalletStore()
    const isTransactionModalVisible = ref(false)

    onMounted(async () => {
      await walletStore.fetchWallet()
    })

    const openTransactionModal = () => {
      isTransactionModalVisible.value = true
    }

    const closeTransactionModal = async () => {
      isTransactionModalVisible.value = false
      await walletStore.fetchWallet()
    }

    const confirmDeleteTransaction = async transactionId => {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        await walletStore.removeTransaction(transactionId)
      }
    }

    const formatDate = dateStr => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toISOString().split('T')[0]
    }

    return {
      walletStore,
      isTransactionModalVisible,
      openTransactionModal,
      closeTransactionModal,
      confirmDeleteTransaction,
      formatDate
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/wallet';
</style>
