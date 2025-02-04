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
            <!-- Actions column -->
            <th scope="col"></th>
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
            <!-- Actions -->
            <td>
              <button class="btn-delete" aria-label="Delete" @click="handleDelete(crypto.itemId)">
                <!-- Use Bootstrap's trash3-fill icon -->
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Notification Modal -->
    <AddNotificationModal
      v-if="isAddNotificationModalVisible"
      :currency="userCurrency"
      @save="handleNotificationSave"
      @close="isAddNotificationModalVisible = false"
    />

    <ListNotificationModal
      v-if="isListNotificationModalVisible"
      :currency="userCurrency"
      @close="isListNotificationModalVisible = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useCryptoStore } from '@/stores/CryptoStore'
import { useSort } from '../composables/table/useSort'
import { useFormat } from '../composables/table/useFormat'
import AddNotificationModal from '@/components/watchlist/AddNotificationModal.vue'
import ListNotificationModal from '@/components/watchlist/ListNotificationModal.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProfileWatchlist',
  components: {
    AddNotificationModal,
    ListNotificationModal
  },
  props: {
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
    const selectedCurrency = computed(() => cryptoStore.selectedCurrency)

    // Initialization on component mount
    onMounted(async () => {
      console.log('ProfileWatchlist mounted')
      try {
        await watchlistStore.fetchWatchlist()
        console.log('Watchlist:', watchlistStore.watchlist)
      } catch (e) {
        error.value = e.message
      } finally {
        isLoading.value = false
      }
    })

    // Computed property mapping watchlist items to cryptocurrency details
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

    // Sorting
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(cryptocurrencies)
    const finalCryptocurrencies = sortedData

    // Formatting functions
    const { formatCurrency, formatPercentage, formatDate } = useFormat()

    watch(
      selectedCurrency,
      newCurrency => {
        if (!isLoading.value) {
          try {
            cryptoStore.setCurrency(newCurrency)
            watchlistStore.fetchWatchlist()
          } catch (e) {
            console.error('Failed to update currency:', e)
            error.value = e.message
          }
        }
      },
      { immediate: true }
    )

    // Modal visibility state
    const isAddNotificationModalVisible = ref(false)
    const isListNotificationModalVisible = ref(false)

    // Methods
    const addNotification = () => {
      isAddNotificationModalVisible.value = true
    }

    const listNotification = () => {
      isListNotificationModalVisible.value = true
    }

    const handleNotificationSave = notificationData => {
      watchlistStore.createAlert(
        notificationData.cryptoId,
        notificationData.price,
        notificationData.currency,
        notificationData
      )
      isAddNotificationModalVisible.value = false
    }

    const toast = useToast()
    const handleDelete = async itemId => {
      try {
        const resRemoval = watchlistStore.removeItem(itemId)
        if (resRemoval) {
          toast.success('Item removed successfully')
        } else {
          toast.error('Item not removed successfully')
        }
        // Refresh the watchlist after deletion
        watchlistStore.fetchWatchlist()
      } catch (e) {
        console.error('Failed to delete item:', e)
        error.value = e.message
      }
    }

    return {
      isLoading,
      error,
      selectedCurrency,
      cryptocurrencies,
      sortTable,
      finalCryptocurrencies,
      sortKey,
      sortAsc,
      formatCurrency,
      formatPercentage,
      formatDate,
      isAddNotificationModalVisible,
      isListNotificationModalVisible,
      addNotification,
      listNotification,
      handleNotificationSave,
      handleDelete
    }
  }
}
</script>

<style scoped>
.btn-delete {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #ff4d4d; /* Example color for delete action */
  font-size: 1rem;
}

.btn-delete:hover {
  color: #cc0000; /* Darker shade on hover */
}

.btn-delete i {
  pointer-events: none; /* Makes the icon non-target for events */
}
</style>
