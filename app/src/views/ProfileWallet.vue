<template>
  <div class="container my-4">
    <!-- Current Balance Card -->
    <div class="card mb-4" style="width: 18rem">
      <div class="card-body">
        <h4 class="card-title">Current Balance</h4>
        <p class="card-text fs-4">
          $
          {{
            // Se balance non è definito, usa 0
            (walletStore.wallet.balance !== undefined ? walletStore.wallet.balance : 0).toFixed(2)
          }}
        </p>
      </div>
    </div>

    <!-- Add Transaction Button -->
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary" @click="openTransactionModal">+Add Transaction</button>
    </div>
    <TransactionModal :isVisible="isTransactionModalVisible" @close="closeTransactionModal" />

    <!-- Transactions Table -->
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Crypto</th>
            <th>Quantity</th>
            <th>Transaction Type</th>
            <th>Date</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr
            v-for="(transaction, index) in walletStore.wallet?.transactions || []"
            :key="transaction.id"
          >
            <td>{{ index + 1 }}</td>
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
              $
              {{
                transaction.priceAtPurchase !== undefined && transaction.priceAtPurchase !== null
                  ? transaction.priceAtPurchase.toFixed(2)
                  : '0.00'
              }}
            </td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="confirmDeleteTransaction(transaction.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!(walletStore.wallet?.transactions && walletStore.wallet.transactions.length)">
            <td colspan="7" class="text-center">Nessuna transazione.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '../stores/WalletStore'
import TransactionModal from '../components/modals/TransactionModal.vue'

export default {
  name: 'ProfileWallet',
  components: { TransactionModal },
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
      if (window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
        const success = await walletStore.removeTransaction(transactionId)
        if (!success) {
          alert(`Errore: ${walletStore.error}`)
        } else {
          await walletStore.fetchWallet()
        }
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
