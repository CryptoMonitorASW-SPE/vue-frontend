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

      <!-- Table container for scroll and region accessibility -->
      <TransactionsTable
        :transactions="walletStore.wallet?.transactions || []"
        @delete-transaction="confirmDeleteTransaction"
      />
    </section>
  </div>
</template>
<script>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useWalletStore } from '@/store/WalletStore'

const WalletPerformanceChart = defineAsyncComponent(
  () => import('@/components/wallet/WalletPerformanceChart.vue')
)
const WalletPieChart = defineAsyncComponent(() => import('@/components/wallet/WalletPieChart.vue'))
const TransactionModal = defineAsyncComponent(
  () => import('@/components/wallet/TransactionModal.vue')
)
const TransactionsTable = defineAsyncComponent(() => import('@/components/wallet/WalletTable.vue'))
export default {
  name: 'ProfileWallet',
  components: {
    TransactionModal,
    WalletPieChart,
    WalletPerformanceChart,
    TransactionsTable
  },
  setup() {
    const walletStore = useWalletStore()
    const isTransactionModalVisible = ref(false)

    onMounted(async () => {
      await walletStore.fetchWallet()
    })

    function openTransactionModal() {
      isTransactionModalVisible.value = true
    }

    async function closeTransactionModal() {
      isTransactionModalVisible.value = false
      await walletStore.fetchWallet()
    }

    async function confirmDeleteTransaction(transactionId) {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        await walletStore.removeTransaction(transactionId)
      }
    }

    function formatDate(dateStr) {
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
