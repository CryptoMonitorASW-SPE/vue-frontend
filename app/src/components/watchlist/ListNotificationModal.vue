<template>
  <div
    class="modal-overlay"
    role="button"
    aria-modal="true"
    aria-label="Close modal by clicking the background or using keyboard"
    tabindex="0"
    @keydown.enter="closeModal"
    @keydown.space.prevent="closeModal"
    @click.self="closeModal"
  >
    <div class="modal-content-larger">
      <div class="modal-header">
        <h3>Notifications</h3>
        <button class="close-button" aria-label="Close modal" @click="closeModal">×</button>
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.alertId">
              <td>{{ alert.cryptoId }}</td>
              <td>{{ formatCurrency(alert.targetPrice, currency) }}</td>
              <td>{{ alert.alertType }}</td>
              <td>
                <span v-if="alert.message && alert.message.length > 0" :title="alert.message">
                  {{ alert.message }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span
                  :class="{
                    'status-active': alert.active,
                    'status-inactive': !alert.active
                  }"
                >
                  {{ alert.active ? 'Active' : 'Not Active' }}
                </span>
              </td>
              <td class="actions-cell">
                <!-- Toggle Button -->
                <button
                  class="btn-toggle"
                  :title="alert.active ? 'Deactivate Alert' : 'Activate Alert'"
                  @click="handleToggle(alert.alertId)"
                >
                  <i class="bi" :class="alert.active ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
                </button>
                <!-- Delete Button -->
                <button class="btn-delete" title="Delete" @click="handleDelete(alert.alertId)">
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

    onMounted(() => {
      watchlistStore.fetchAlerts()
    })

    // Filter out any alert that has been triggered.
    const alerts = computed(() => {
      return watchlistStore.alerts
        .filter(alert => !alert.triggered) // Do not show triggered notifications
        .map(alert => ({
          alertId: alert.id,
          cryptoId: alert.cryptoId,
          targetPrice: alert.alertPrice,
          currency: alert.currency,
          alertType: alert.alertType === 'below' ? 'Below' : 'Above',
          message: alert.message.message,
          active: alert.active,
          triggered: alert.triggered
        }))
    })

    const handleDelete = async alertId => {
      try {
        await watchlistStore.deleteAlert(alertId)
      } catch (error) {
        console.error('Failed to delete alert:', error)
      }
    }

    // New method to toggle the alert's active state and update it locally.
    const handleToggle = async alertId => {
      try {
        // Assuming your store has a toggleAlert method.
        const active = alerts.value.find(alert => alert.alertId === alertId).active
        await watchlistStore.toggleAlert(alertId, !active)
      } catch (error) {
        console.error('Failed to toggle alert:', error)
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      alerts,
      formatCurrency,
      closeModal,
      handleDelete,
      handleToggle
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
  z-index: 1000; /* Ensure it's above other items */
}

.modal-content-larger {
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  width: 80%; /* Larger width */
  max-width: 1200px; /* Max width to maintain readability */
  max-height: 80vh;
  overflow-y: auto;
}

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
  table-layout: fixed;
}

th,
td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

/* Active alerts are now green */
.status-active {
  color: green;
  font-weight: bold;
}

/* Inactive alerts are styled in red */
.status-inactive {
  color: red;
  font-weight: bold;
}

/* Action buttons container */
.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-delete,
.btn-toggle,
.btn-activate,
.btn-deactivate {
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-toggle {
  background-color: #007bff;
  color: white;
}

.btn-toggle:hover {
  background-color: #0056b3;
}
</style>
