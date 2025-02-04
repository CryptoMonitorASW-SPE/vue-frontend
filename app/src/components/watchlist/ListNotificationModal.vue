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
        <h3>Notifications</h3>
        <button class="close-button" aria-label="Close" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div v-if="alerts.length === 0" class="empty-message">
          No notifications set. Click "Add Notification" to create one.
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Crypto ID</th>
              <th>Target Price</th>
              <th>Alert Type</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.alertId">
              <td>{{ alert.cryptoId }}</td>
              <td>{{ formatCurrency(alert.targetPrice, currency) }}</td>
              <td>{{ alert.alertType }}</td>
              <td>{{ alert.message || 'N/A' }}</td>
              <td>
                <button class="btn-delete" @click="handleDelete(alert.alertId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useFormat } from '@/composables/table/useFormat'
import { computed } from 'vue'

export default {
  name: 'ListNotificationModal',
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup() {
    const watchlistStore = useWatchlistStore()
    const { formatCurrency } = useFormat()

    const alerts = computed(() => {
      return watchlistStore.alerts.map(alert => ({
        alertId: alert.alertId,
        cryptoId: alert.cryptoId,
        targetPrice: alert.targetPrice,
        currency: alert.currency,
        alertType: alert.alertType === 'below' ? 'Below' : 'Above',
        message: alert.message
      }))
    })

    const handleDelete = async alertId => {
      try {
        await watchlistStore.deleteAlert(alertId)
      } catch (error) {
        console.error('Failed to delete alert:', error)
      }
    }

    return {
      alerts,
      formatCurrency,
      handleDelete
    }
  }
}
</script>

<style scoped>
/* Styles remain the same */
</style>
