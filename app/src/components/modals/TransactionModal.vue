<template>
  <div
    v-if="isVisible"
    class="modal-overlay d-flex align-items-center justify-content-center"
    role="button"
    aria-label="Close modal by clicking on the background"
    tabindex="0"
    @click="closeModal"
    @keydown.enter.prevent="closeModal"
    @keydown.space.prevent="closeModal"
  >
    <div class="transaction-modal modal-content p-4" role="dialog" aria-modal="true" @click.stop>
      <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
      <h4 class="modal-title mb-4">Add Transaction</h4>
      <form>
        <!-- Row: Crypto and Price per Coin -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="transactionCrypto" class="form-label">Crypto</label>
            <select id="transactionCrypto" v-model="localTransaction.cryptoId" class="form-select">
              <option value="" disabled>Select Crypto</option>
              <option
                v-for="crypto in cryptoStore.cryptocurrencies"
                :key="crypto.id"
                :value="crypto.id"
              >
                {{ crypto.name }}
              </option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label for="pricePerCoin" class="form-label">Price per Coin</label>
            <input
              id="pricePerCoin"
              v-model.number="localTransaction.priceAtPurchase"
              type="number"
              step="any"
              class="form-control"
              placeholder="Enter price per coin"
            />
          </div>
        </div>
        <!-- Row: Quantity and Transaction Date -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="transactionQuantity" class="form-label">Quantity</label>
            <input
              id="transactionQuantity"
              v-model.number="localTransaction.quantity"
              type="number"
              step="any"
              class="form-control"
              placeholder="Enter quantity"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="transactionDate" class="form-label">Transaction Date</label>
            <input
              id="transactionDate"
              v-model="localTransaction.doneAt"
              type="date"
              class="form-control"
            />
          </div>
        </div>
        <!-- Row: Transaction Type -->
        <div class="mb-3">
          <label for="transactionType" class="form-label">Transaction Type</label>
          <select id="transactionType" v-model="localTransaction.type" class="form-select">
            <option value="" disabled>Select Transaction Type</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
      </form>
      <div class="modal-buttons d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="saveTransaction">
          Save Transaction
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useWalletStore } from '../../stores/WalletStore'
import { useCryptoStore } from '../../stores/CryptoStore'
import { useToast } from 'vue-toastification'

export default {
  name: 'TransactionModal',
  props: { isVisible: { type: Boolean, required: true } },
  data() {
    return {
      localTransaction: {
        cryptoId: '',
        quantity: null,
        priceAtPurchase: null,
        type: 'BUY',
        doneAt: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    cryptoStore() {
      return useCryptoStore()
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.resetForm()
      }
    }
  },
  methods: {
    resetForm() {
      this.localTransaction = {
        cryptoId: '',
        quantity: null,
        priceAtPurchase: null,
        type: 'BUY',
        doneAt: new Date().toISOString().split('T')[0]
      }
    },
    closeModal() {
      this.$emit('close')
    },
    async saveTransaction() {
      if (!window.confirm('Are you sure you want to add this transaction?')) {
        return
      }
      const payload = { ...this.localTransaction }
      const walletStore = useWalletStore()
      const result = await walletStore.addTransaction(payload)
      const toast = useToast()
      if (result) {
        toast.success('Transaction added successfully')
      } else {
        toast.error('Error during save of the transaction')
      }
      // Close modal automatically if there’s no error in wallet store
      if (!walletStore.error) {
        this.closeModal()
      } else {
        alert(`Errore: ${walletStore.error}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base' as base;
@use 'sass:map';
@use 'sass:color';
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}
.transaction-modal {
  background-color: map.get(base.$light-theme, 'background-color');
  border-radius: 0.25rem;
  position: relative;
  max-width: 500px;
  width: 100%;
  .dark-mode & {
    background-color: map.get(base.$dark-theme, 'background-color');
    color: map.get(base.$dark-theme, 'text-color');
  }
}
.btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  .dark-mode & {
    filter: invert(1) grayscale(100%) brightness(200%);
  }
}
</style>
