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
        <table
          v-else
          class="modal-table"
          role="grid"
          aria-label="List Notifications Table"
          tabindex="0"
          @keydown.stop
        >
          <caption class="sr-only">
            List Notifications Table showing notification details for monitored cryptocurrencies.
          </caption>
          <thead>
            <tr data-row="0">
              <th scope="col" data-col="0" tabindex="0" @keydown="handleGridNavigation">#</th>
              <th scope="col" data-col="1" tabindex="0" @keydown="handleGridNavigation">
                Crypto ID
              </th>
              <th scope="col" data-col="2" tabindex="0" @keydown="handleGridNavigation">
                Target Price
              </th>
              <th scope="col" data-col="3" tabindex="0" @keydown="handleGridNavigation">
                Alert Type
              </th>
              <th scope="col" data-col="4" tabindex="0" @keydown="handleGridNavigation">Message</th>
              <th scope="col" data-col="5" tabindex="0" @keydown="handleGridNavigation">Status</th>
              <th scope="col" data-col="6" tabindex="0" @keydown="handleGridNavigation">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alert, index) in alerts" :key="alert.alertId" :data-row="index + 1">
              <th
                role="rowheader"
                data-col="0"
                tabindex="0"
                data-label="#"
                @keydown="handleGridNavigation"
              >
                {{ index + 1 }}
              </th>
              <td
                role="gridcell"
                data-col="1"
                tabindex="0"
                data-label="Crypto ID"
                @keydown="handleGridNavigation"
              >
                {{ alert.cryptoId }}
              </td>
              <td
                role="gridcell"
                data-col="2"
                tabindex="0"
                data-label="Target Price"
                @keydown="handleGridNavigation"
              >
                {{ formatCurrency(alert.targetPrice, currency) }}
              </td>
              <td
                role="gridcell"
                data-col="3"
                tabindex="0"
                data-label="Alert Type"
                @keydown="handleGridNavigation"
              >
                {{ alert.alertType }}
              </td>
              <td
                role="gridcell"
                data-col="4"
                tabindex="0"
                data-label="Message"
                @keydown="handleGridNavigation"
              >
                <span v-if="alert.message && alert.message.length > 0" :title="alert.message">
                  {{ alert.message }}
                </span>
                <span v-else>-</span>
              </td>
              <td
                role="gridcell"
                data-col="5"
                tabindex="0"
                data-label="Status"
                @keydown="handleGridNavigation"
              >
                <span
                  :class="{
                    'status-active': alert.active,
                    'status-inactive': !alert.active
                  }"
                >
                  {{ alert.active ? 'Active' : 'Not Active' }}
                </span>
              </td>
              <td
                role="gridcell"
                data-col="6"
                class="actions-cell"
                tabindex="0"
                data-label="Actions"
                @keydown="handleGridNavigation"
              >
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
          <tfoot>
            <tr>
              <td id="table-summary" colspan="7" role="contentinfo">
                List of notifications for monitored cryptocurrencies. Click on actions to toggle or
                delete alerts.
                <span class="sr-only">End of notifications table</span>
              </td>
            </tr>
          </tfoot>
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

    const alerts = computed(() => {
      return watchlistStore.alerts
        .filter(alert => !alert.triggered)
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

    const handleToggle = async alertId => {
      try {
        const active = alerts.value.find(a => a.alertId === alertId).active
        await watchlistStore.toggleAlert(alertId, !active)
      } catch (error) {
        console.error('Failed to toggle alert:', error)
      }
    }

    /**
     * Handle arrow key navigation in the grid.
     */
    const handleGridNavigation = event => {
      const currentCell = event.currentTarget
      const tr = currentCell.closest('tr')
      if (!tr) return
      const row = Number(tr.getAttribute('data-row'))
      const col = Number(currentCell.getAttribute('data-col'))
      if (isNaN(row) || isNaN(col)) return

      let newRow = row
      let newCol = col

      switch (event.key) {
        case 'ArrowRight':
          newCol = col + 1
          break
        case 'ArrowLeft':
          newCol = col - 1
          break
        case 'ArrowDown':
          newRow = row + 1
          break
        case 'ArrowUp':
          newRow = row - 1
          break
        default:
          return
      }

      event.preventDefault()

      const table = currentCell.closest('table')
      if (!table) return

      const targetCell = table.querySelector(
        `[data-row="${newRow}"] [data-col="${newCol}"], [data-row="${newRow}"][data-col="${newCol}"]`
      )
      if (targetCell) {
        targetCell.focus()
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
      handleToggle,
      handleGridNavigation
    }
  }
}
</script>
