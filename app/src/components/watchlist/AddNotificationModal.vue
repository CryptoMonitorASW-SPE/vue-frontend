<template>
  <div
    class="modal-overlay"
    role="button"
    aria-label="Close modal by clicking the background or using keyboard"
    tabindex="0"
    @keydown.enter="closeModal"
    @keydown.space.prevent="closeModal"
    @click.self="closeModal"
  >
    <div class="modal-container">
      <h3>Add Notification</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="crypto">Cryptocurrency ID</label>
          <input
            id="crypto"
            v-model="formData.cryptoId"
            type="text"
            placeholder="e.g., btc"
            required
          />
        </div>
        <div class="form-group">
          <label for="price">Price Threshold ({{ currency.toUpperCase() }})</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            step="0.01"
            placeholder="e.g., 30000"
            required
          />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <input
            id="message"
            v-model="formData.message"
            type="text"
            placeholder="Enter a custom message (optional)"
          />
        </div>
        <div class="form-group">
          <label for="alertType">Alert Type</label>
          <select id="alertType" v-model="formData.alertType" required>
            <option value="ABOVE">Above</option>
            <option value="BELOW">Below</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn secondary" @click="closeModal">Cancel</button>
          <button type="submit" class="btn primary">Save Notification</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddNotificationModal',
  props: {
    // This currency prop will be used to display the currency but can also be included in the payload
    currency: {
      type: String,
      default: 'usd'
    }
  },
  data() {
    return {
      formData: {
        cryptoId: '',
        price: null, // Changed from "threshold" to "price"
        message: '', // Message field to be sent as JSON body content
        alertType: 'ABOVE' // Default alertType value
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('save', { ...this.formData })

      // Reset form data after submission
      this.formData.cryptoId = ''
      this.formData.price = null
      this.formData.message = ''
      this.formData.alertType = 'ABOVE'
      this.closeModal()
    },
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* Your existing styles here */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  padding: 1.5rem;
  border-radius: 6px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input[type='text'],
input[type='number'] {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background-color: var(--primary-color, #007bff);
  color: #fff;
}

.btn.primary:hover {
  background-color: var(--primary-color-dark, #0056b3);
}

.btn.secondary {
  background-color: #ddd;
  color: #333;
}

.btn.secondary:hover {
  background-color: #ccc;
}
</style>
