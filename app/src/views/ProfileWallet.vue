<template>
  <div class="container my-4">
    <!-- Current Balance Card -->
    <div class="card mb-4" style="width: 18rem">
      <div class="card-body">
        <h4 class="card-title">Current Balance</h4>
        <p class="card-text fs-4">$ 12,345.67</p>
      </div>
    </div>

    <!-- Add Transaction Button -->
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-primary" @click="openTransactionModal">+Add Transaction</button>
    </div>
    <TransactionModal
      :isVisible="isTransactionModalVisible"
      @close="closeTransactionModal"
      @save="handleSaveTransaction"
    />

    <!-- Transactions Table -->
    <div class="table-responsive">
      <table class="table">
        <thead class="table">
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
          <!-- Esempio di transazione -->
          <tr>
            <td>1</td>
            <td>Bitcoin</td>
            <td>0.005</td>
            <td>
              <span class="badge bg-success">BUY</span>
            </td>
            <td>2023-10-23</td>
            <td>$ 30,000</td>
            <td>
              <button class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Ethereum</td>
            <td>0.1</td>
            <td>
              <span class="badge bg-danger">SELL</span>
            </td>
            <td>2023-10-22</td>
            <td>$ 2,000</td>
            <td>
              <button class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <!-- Altre righe verranno aggiunte dinamicamente -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TransactionModal from '../components/modals/TransactionModal.vue'

export default {
  name: 'ProfileWallet',
  components: {
    TransactionModal
  },
  data() {
    return {
      isTransactionModalVisible: false
    }
  },
  methods: {
    openTransactionModal() {
      this.isTransactionModalVisible = true
    },
    closeTransactionModal() {
      this.isTransactionModalVisible = false
    },
    handleSaveTransaction() {
      console.log('Transaction saved:', transactionData)
      this.closeTransactionModal()
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/wallet';
</style>
