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
            <label for="crypto-id">Cryptocurrency</label>
            <select id="crypto-id" v-model="cryptoId" required>
              <option v-for="crypto in cryptocurrencies" :key="crypto.id" :value="crypto.id">
                {{ crypto.name }} ({{ crypto.symbol }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="price">Price ({{ currency }})</label>
            <input
              id="price"
              v-model.number="price"
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
    },
    cryptocurrencies: {
      type: Array,
      required: true
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const cryptoId = ref(props.cryptocurrencies.length > 0 ? props.cryptocurrencies[0].id : null) // Default to first crypto if available
    const price = ref(null) // make it null initially
    const alertType = ref('below')
    const message = ref('')
    const currency = props.currency
    console.log('Currency prop:', currency)

    watchEffect(() => {
      // If cryptoId is null and there are cryptocurrencies available, set it to the first one
      if (cryptoId.value === null && props.cryptocurrencies.length > 0) {
        cryptoId.value = props.cryptocurrencies[0].id
      }

      console.log('Currency prop changed:', props.currency)
      console.log('Cryptocurrencies prop changed:', props.cryptocurrencies)
    })

    const handleSubmit = () => {
      if (isNaN(price.value) || price.value <= 0) {
        alert('Please enter a valid positive number for the price')
        return
      }

      const notificationData = {
        cryptoId: cryptoId.value,
        price: price.value,
        alertType: alertType.value,
        message: message.value
      }
      console.log(notificationData)
      emit('save', notificationData)
      // Reset form after submit
      cryptoId.value = props.cryptocurrencies.length > 0 ? props.cryptocurrencies[0].id : null
      price.value = null
      alertType.value = 'below'
      message.value = ''
    }
    const closeModal = () => {
      emit('close')
      cryptoId.value = props.cryptocurrencies.length > 0 ? props.cryptocurrencies[0].id : null
      price.value = null
      alertType.value = 'below'
      message.value = ''
    }

    return {
      cryptoId,
      price,
      currency,
      alertType,
      message,
      handleSubmit,
      closeModal,
      cryptocurrencies: props.cryptocurrencies
    }
  }
}
</script>
