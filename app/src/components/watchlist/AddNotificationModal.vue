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
