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
      <!-- Pulsante X per chiudere in alto a destra -->
      <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
      <h4 class="modal-title mb-4">Add Transaction</h4>
      <form>
        <!-- Row: Crypto selection and Price per Coin -->
        <div class="row">
          <!-- Campo: Crypto -->
          <div class="col-md-6 mb-3">
            <label for="transactionCrypto" class="form-label">Crypto</label>
            <select id="transactionCrypto" v-model="localTransaction.crypto" class="form-select">
              <option value="" disabled>Select Crypto</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="litecoin">Litecoin</option>
              <!-- Aggiungi altre opzioni se necessario -->
            </select>
          </div>
          <!-- Campo: Price per Coin -->
          <div class="col-md-6 mb-3">
            <label for="pricePerCoin" class="form-label">Price per Coin</label>
            <input
              id="pricePerCoin"
              v-model.number="localTransaction.price"
              type="number"
              step="any"
              class="form-control"
              placeholder="Enter price per coin"
            />
          </div>
        </div>
        <!-- Row: Quantity and Transaction Date -->
        <div class="row">
          <!-- Campo: Quantity -->
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
          <!-- Campo: Transaction Date -->
          <div class="col-md-6 mb-3">
            <label for="transactionDate" class="form-label">Transaction Date</label>
            <input
              id="transactionDate"
              v-model="localTransaction.date"
              type="date"
              class="form-control"
            />
          </div>
        </div>
        <!-- Campo: Transaction Type -->
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
export default {
  name: 'TransactionModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localTransaction: {
        crypto: '',
        quantity: null,
        type: 'BUY'
      }
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        // Resetta il form ogni volta che viene aperto il modal
        this.localTransaction = {
          crypto: '',
          quantity: null,
          type: 'BUY'
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    saveTransaction() {
      // Logica di salvataggio da implementare in seguito:
      // Emittiamo l'evento con i dati della transazione
      this.$emit('save', this.localTransaction)
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
