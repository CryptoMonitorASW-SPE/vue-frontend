<template>
  <div class="crypto-table-container">
    <WatchlistHeader @add-notification="addNotification" @list-notification="listNotification" />

    <WatchlistTable :cryptocurrencies="finalCryptocurrencies" @delete="handleDelete" />

    <AddNotificationModal
      v-if="isAddNotificationModalVisible"
      :currency="selectedCurrency"
      :cryptocurrencies="finalCryptocurrencies"
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
import AddNotificationModal from '@/components/watchlist/AddNotificationModal.vue'
import ListNotificationModal from '@/components/watchlist/ListNotificationModal.vue'
import WatchlistHeader from '@/components/watchlist/WatchlistHeader.vue'
import WatchlistTable from '@/components/watchlist/WatchlistTable.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProfileWatchlist',
  components: {
    AddNotificationModal,
    ListNotificationModal,
    WatchlistHeader,
    WatchlistTable
  },
  setup() {
    const watchlistStore = useWatchlistStore()
    const cryptoStore = useCryptoStore()
    const isLoading = ref(true)
    const error = ref(null)
    const selectedCurrency = computed(() => cryptoStore.selectedCurrency)

    onMounted(async () => {
      try {
        await watchlistStore.fetchWatchlist()
      } catch (e) {
        error.value = e.message
      } finally {
        isLoading.value = false
      }
    })

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

    const { sortedData } = useSort(cryptocurrencies)
    const finalCryptocurrencies = sortedData

    watch(
      selectedCurrency,
      async newCurrency => {
        if (!isLoading.value) {
          try {
            cryptoStore.setCurrency(newCurrency)
            await watchlistStore.fetchWatchlist()
          } catch (e) {
            console.error('Failed to update currency:', e)
            error.value = e.message
          }
        }
      },
      { immediate: true }
    )

    const isAddNotificationModalVisible = ref(false)
    const isListNotificationModalVisible = ref(false)

    const addNotification = () => {
      isAddNotificationModalVisible.value = true
    }

    const listNotification = () => {
      isListNotificationModalVisible.value = true
    }

    const handleNotificationSave = notificationData => {
      const result = watchlistStore.createAlert(
        notificationData.cryptoId,
        notificationData.price,
        selectedCurrency.value,
        notificationData.alertType,
        notificationData.message
      )

      if (result) {
        toast.success('Notification added successfully')
      } else {
        toast.error('Failed to add notification')
      }

      isAddNotificationModalVisible.value = false
    }

    const toast = useToast()
    const handleDelete = async itemId => {
      try {
        const resRemoval = watchlistStore.removeItem(itemId)
        if (resRemoval) {
          toast.success('Item removed successfully')
          await watchlistStore.fetchWatchlist()
        } else {
          toast.error('Item not removed successfully')
        }
      } catch (e) {
        console.error('Failed to delete item:', e)
        error.value = e.message
      }
    }

    return {
      isLoading,
      error,
      selectedCurrency,
      finalCryptocurrencies,
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

<style lang="scss">
@use '../assets/scss/watchlist';
</style>
