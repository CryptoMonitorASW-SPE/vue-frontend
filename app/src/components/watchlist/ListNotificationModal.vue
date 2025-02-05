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
              <th>Optional Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.alertId">
              <td>{{ alert.cryptoId }}</td>
              <td>{{ formatCurrency(alert.targetPrice, currency) }}</td>
              <td>{{ alert.alertType }}</td>
              <td>
                <span
                  v-if="alert.message && alert.message.length > 0"
                  title="Notification message set"
                  >✓</span
                >
                <span v-else>-</span>
              </td>
              <td>
                <button class="btn-delete" aria-label="Delete" @click="handleDelete(alert.alertId)">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useFormat } from '@/composables/table/useFormat'

export default {
  name: 'ListNotificationModal',
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const watchlistStore = useWatchlistStore()
    const { formatCurrency } = useFormat()

    // Fetch the latest alerts when the modal mounts
    onMounted(() => {
      watchlistStore.fetchAlerts()
    })

    const alerts = computed(() => {
      // Transform alerts data if needed (e.g., capitalizing alertType)
      return watchlistStore.alerts.map(alert => ({
        alertId: alert.id,
        cryptoId: alert.cryptoId,
        targetPrice: alert.alertPrice,
        currency: alert.currency.type,
        alertType: alert.alertType === 'below' ? 'Below' : 'Above',
        message: alert.message.message
      }))
    })

    const handleDelete = async alertId => {
      try {
        await watchlistStore.deleteAlert(alertId)
      } catch (error) {
        console.error('Failed to delete alert:', error)
      }
    }

    // Example closeModal method if needed (or use $emit('close') from the button)
    const closeModal = () => {
      emit('close')
    }

    return {
      alerts,
      formatCurrency,
      handleDelete,
      closeModal
    }
  }
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-top: 1rem;
}

.empty-message {
  text-align: center;
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  border: 1px solid #ddd;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
