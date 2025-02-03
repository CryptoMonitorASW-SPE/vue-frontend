<template>
  <div class="crypto-table-container">
    <!-- Header with actions -->
    <div class="table-header">
      <h2>Watched Cryptocurrencies</h2>
      <div class="table-actions">
        <button class="btn" @click="addNotification">Add Notification</button>
        <button class="btn" @click="listNotification">List Notification</button>
      </div>
    </div>

    <div class="crypto-table">
      <table>
        <thead>
          <tr>
            <!-- ADDED column with sorting -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="sortKey === 'added' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
              tabindex="0"
              @click="sortTable('added')"
              @keydown.enter="sortTable('added')"
            >
              ADDED
              <span v-if="sortKey === 'added'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- Logo column is not sortable -->
            <th scope="col">Logo</th>
            <!-- Name column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
              tabindex="0"
              @click="sortTable('name')"
              @keydown.enter="sortTable('name')"
            >
              Name
              <span v-if="sortKey === 'name'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- Symbol column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="sortKey === 'symbol' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
              tabindex="0"
              @click="sortTable('symbol')"
              @keydown.enter="sortTable('symbol')"
            >
              Symbol
              <span v-if="sortKey === 'symbol'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- Price column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="sortKey === 'price' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
              tabindex="0"
              @click="sortTable('price')"
              @keydown.enter="sortTable('price')"
            >
              Price
              <span v-if="sortKey === 'price'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- Change column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="
                sortKey === 'priceChangePercentage'
                  ? sortAsc
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
              tabindex="0"
              @click="sortTable('priceChangePercentage')"
              @keydown.enter="sortTable('priceChangePercentage')"
            >
              Change
              <span v-if="sortKey === 'priceChangePercentage'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- UpdatedDate column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="
                sortKey === 'lastUpdated' ? (sortAsc ? 'ascending' : 'descending') : 'none'
              "
              tabindex="0"
              @click="sortTable('lastUpdated')"
              @keydown.enter="sortTable('lastUpdated')"
            >
              UpdatedDate
              <span v-if="sortKey === 'lastUpdated'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crypto in finalCryptocurrencies"
            :key="crypto.id"
            :class="{ 'updated-row': crypto.updated }"
          >
            <!-- ADDED date field -->
            <td>{{ formatDate(crypto.added) }}</td>
            <!-- Logo -->
            <td>
              <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
            </td>
            <!-- Name with a link to details -->
            <td>
              <RouterLink
                :to="`/crypto/${crypto.id}`"
                class="crypto-link"
                :aria-label="`View details for ${crypto.name}`"
              >
                {{ crypto.name }}
              </RouterLink>
            </td>
            <!-- Symbol -->
            <td>{{ crypto.symbol.toUpperCase() }}</td>
            <!-- Price -->
            <td>{{ formatCurrency(crypto.price, selectedCurrency) }}</td>
            <!-- Change -->
            <td
              :class="{
                positive: crypto.priceChangePercentage >= 0,
                negative: crypto.priceChangePercentage < 0
              }"
            >
              {{ formatPercentage(crypto.priceChangePercentage) }}
            </td>
            <!-- UpdatedDate -->
            <td>{{ formatDate(crypto.lastUpdated) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Notification Modal -->
    <AddNotificationModal
      v-if="isAddNotificationModalVisible"
      :currency="selectedCurrency"
      @save="handleNotificationSave"
      @close="isAddNotificationModalVisible = false"
    />

    <ListNotificationModal
      v-if="isListNotificationModalVisible"
      :currency="selectedCurrency"
      @close="isListNotificationModalVisible = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useCryptoStore } from '../stores/CryptoStore'
import { useWatchlistStore } from '../stores/WatchlistStore'
import { useSort } from '../composables/table/useSort'
import { useFormat } from '../composables/table/useFormat'
import AddNotificationModal from '../components/watchlist/AddNotificationModal.vue'
import ListNotificationModal from '../components/watchlist/ListNotificationModal.vue'

export default {
  name: 'ProfileWatchlist',
  components: {
    AddNotificationModal,
    ListNotificationModal
  },
  props: {
    // If you plan to add filters later
    filters: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup() {
    const watchlistStore = useWatchlistStore()
    const cryptoStore = useCryptoStore()
    const isLoading = ref(true)
    const error = ref(null)
    const selectedCurrency = ref('usd')

    // Currency computed property
    const currentCurrency = computed(() => ({
      value: selectedCurrency.value.toUpperCase(),
      timestamp: Date.now() // Force update on currency change
    }))

    // Initialization
    onMounted(async () => {
      try {
        initializeSocket()
        await cryptoStore.setCurrency(currentCurrency.value.value)
        await watchlistStore.fetchWatchlist()
        // Set up interval to refresh watchlist data every 60 seconds
        intervalId = setInterval(async () => {
          if (!isLoading.value) {
            await watchlistStore.fetchWatchlist()
          }
        }, 60000)
      } catch (e) {
        error.value = e.message
      } finally {
        isLoading.value = false
      }
    })

    // Single cryptocurrencies computed property
    const cryptocurrencies = computed(() =>
      watchlistStore.watchlist.map(item => {
        const cryptoDetails = cryptoStore.fetchCryptoById(item.cryptoId)
        return {
          id: item.cryptoId,
          itemId: item.itemId,
          name: cryptoDetails.name || item.cryptoId,
          symbol: cryptoDetails.symbol || item.cryptoId,
          price: cryptoDetails.price,
          priceChangePercentage: cryptoDetails.priceChangePercentage24h,
          image: cryptoDetails.image || '',
          added: item.addedAt,
          lastUpdated: cryptoDetails.lastUpdated,
          updated: cryptoDetails.updated || false,
          marketCap: cryptoDetails.marketCap,
          volume24h: cryptoDetails.totalVolume,
          high24h: cryptoDetails.high24h,
          low24h: cryptoDetails.low24h,
          currency: selectedCurrency.value.toUpperCase()
        }
      })
    )

    // Sorting functionality
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(cryptocurrencies)
    const finalCryptocurrencies = sortedData

    // Formatting functions
    const { formatCurrency, formatPercentage, formatDate } = useFormat()

    // Interval variable
    let intervalId = null

    // Watch for currency changes
    watch(
      () => currentCurrency.value.value,
      async newVal => {
        if (!isLoading.value) {
          try {
            await cryptoStore.setCurrency(newVal)
            await watchlistStore.fetchWatchlist()
          } catch (e) {
            console.error('Failed to update currency:', e)
            error.value = e.message
          }
        }
      }
    )

    // Clean up the interval when component unmounts
    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    // State to control modal visibility
    const isAddNotificationModalVisible = ref(false)
    const isListNotificationModalVisible = ref(false)

    return {
      cryptocurrencies,
      finalCryptocurrencies,
      sortTable,
      sortKey,
      sortAsc,
      formatCurrency,
      formatPercentage,
      formatDate,
      selectedCurrency,
      isAddNotificationModalVisible,
      isListNotificationModalVisible
    }
  },
  methods: {
    addNotification() {
      // Show the Add Notification modal
      this.isAddNotificationModalVisible = true
    },
    listNotification() {
      // List notifications
      this.isListNotificationModalVisible = true
    },
    handleNotificationSave(notificationData) {
      // Process the notification data received from the modal
      // For example, save it to a notifications store or perform an API call
      const watchlistStore = useWatchlistStore()
      watchlistStore.createAlert('bitcoin', 50000, 'usd', { message: 'Lorenzo' })
      // Hide the modal after saving
      this.isAddNotificationModalVisible = false
    }
  }
}
</script>

<style scoped>
/* (Existing styles remain unchanged) */

.crypto-table-container {
  padding: 1rem;
}

.table-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  background-color: var(--primary-color, #007bff);
  color: #fff;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.btn:hover,
.btn:focus {
  background-color: var(--primary-color-dark, #0056b3);
  outline: none;
}

.crypto-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

th {
  background-color: #f9f9f9;
}

.crypto-logo {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
}

.crypto-link {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  padding: 0.25rem 0;
}

.crypto-link:hover {
  text-decoration: underline;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.updated-row {
  background-color: #e8f5e9;
}

@media (max-width: 768px) {
  th,
  td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-actions {
    margin-top: 0.5rem;
  }
}
</style>
