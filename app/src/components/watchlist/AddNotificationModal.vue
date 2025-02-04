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
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add Notification</h3>
        <button class="close-button" aria-label="Close" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="crypto-id">Crypto ID</label>
            <input
              id="crypto-id"
              v-model="cryptoId"
              type="text"
              placeholder="Enter cryptocurrency ID"
              required
            />
          </div>
          <div class="form-group">
            <label for="price">Price ({{ currency }})</label>
            <input
              id="price"
              v-model="price"
              type="number"
              :placeholder="'Enter target price in ' + currency"
              required
            />
          </div>
          <div class="form-group">
            <label for="alert-type">Alert Type</label>
            <select id="alert-type" v-model="alertType" required>
              <option value="below">Below</option>
              <option value="above">Above</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Message (Optional)</label>
            <textarea id="message" v-model="message" placeholder="Enter a custom message" />
          </div>
          <button type="submit" class="btn btn-primary">Save Notification</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'

export default {
  name: 'AddNotificationModal',
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const cryptoId = ref('')
    const price = ref('')
    const alertType = ref('below') // Default alert type
    const message = ref('')

    // Watch for changes in props.currency and update the local state if needed
    watchEffect(() => {
      console.log('Currency prop changed:', props.currency)
    })

    const handleSubmit = () => {
      const notificationData = {
        cryptoId: cryptoId.value,
        price: parseFloat(price.value),
        alertType: alertType.value,
        message: message.value
      }

      emit('save', notificationData)
    }

    return {
      cryptoId,
      price,
      alertType,
      message,
      handleSubmit
    }
  }
}
</script>

<style scoped>
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
  z-index: 10;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 100px;
}
</style>
