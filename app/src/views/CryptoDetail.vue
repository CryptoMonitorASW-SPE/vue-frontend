<template>
  <div class="container my-4">
    <!-- Loading State -->
    <div v-if="initialLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading cryptocurrency data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="initialError" class="alert alert-danger">
      Error loading data: {{ initialError }}
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header Row (now with integrated watchlist button) -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <CryptoHeader
            :image="crypto.image"
            :name="crypto.name"
            :symbol="crypto.symbol"
            :rank="crypto.marketCapRank"
            :isAuthenticated="isAuthenticated"
            @toggle-favorite="toggleFavorite"
            @add-to-watchlist="addToWatchlist"
          />
        </div>
      </div>

      <!-- Other content rows -->
      <div class="row mt-4">
        <div class="col-12 col-md-3 mt-5">
          <MarketDataBoxes
            :circulatingSupply="crypto.circulatingSupply"
            :totalSupply="crypto.totalSupply"
            :maxSupply="crypto.maxSupply"
            :ATH="crypto.ath"
            :athChangePercentage="crypto.athChangePercentage"
            :currency="userCurrency"
          />
        </div>
        <div class="col-12 col-md-6">
          <ChartComponent :cryptoId="cryptoId" :currency="userCurrency" />
        </div>
        <div class="col-12 col-md-3 mt-5">
          <CryptoDetailsBoxes :cryptoDetails="cryptoDetails" :currency="userCurrency" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptoDetailStore } from '../stores/CryptoDetailStore'
import { useCryptoStore } from '../stores/CryptoStore'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'
import CryptoHeader from '../components/details/CryptoHeader.vue'
import ChartComponent from '../components/details/CryptoOHLChart.vue'
import MarketDataBoxes from '../components/details/MarketDataBoxes.vue'
import CryptoDetailsBoxes from '../components/details/CryptoDetailsBoxes.vue'

export default {
  name: 'CryptoDetail',
  components: {
    CryptoHeader,
    ChartComponent,
    MarketDataBoxes,
    CryptoDetailsBoxes
  },
  props: {
    cryptoId: {
      type: String,
      required: true
    }
  },
  setup() {
    // Use useRoute to access dynamic route params
    const route = useRoute()
    const cryptoId = computed(() => route.params.id)

    const storeDetail = useCryptoDetailStore()
    const storeCrypto = useCryptoStore()
    const authStore = useAuthenticationStore()
    const { isAuthenticated } = storeToRefs(authStore)

    const userCurrency = computed(() => storeCrypto.selectedCurrency)
    const crypto = computed(() => storeCrypto.fetchCryptoById(cryptoId.value))
    watch(
      userCurrency,
      newCurrency => {
        if (newCurrency) {
          storeDetail.fetchInitialData(cryptoId.value, newCurrency, {
            days: 7, // Default to 1 week
            timeSpan: '1W'
          })
        }
      },
      { immediate: true }
    )

    return {
      crypto,
      cryptoId,
      userCurrency,
      cryptoDetails: computed(() => storeDetail.cryptoDetails),
      initialLoading: computed(() => !storeDetail.initialLoadComplete),
      initialError: computed(() => storeDetail.errorDetails || storeDetail.error),
      isAuthenticated
    }
  },
  methods: {
    addToWatchlist() {
      // axios
      //   .post('/api/watchlist', { cryptoId: this.cryptoId })
      //   .then(response => {
      //     // Handle success (e.g., show a success notification)
      //     console.log('Crypto added to watchlist:', response.data)
      //   })
      //   .catch(error => {
      //     // Handle error (e.g., show an error notification)
      //     console.error('Error adding crypto to watchlist:', error)
      //   })
      console.log('Added to watchlist:', this.cryptoId)
    },
    //TODO: check if the change chart works
    handleTimeframeChange(newTimeSpan) {
      const daysMap = {
        '1D': 1,
        '1W': 7,
        '1M': 30,
        '1Y': 365
      }
      this.$store.fetchChartData(
        this.cryptoId,
        this.userCurrency.value,
        daysMap[newTimeSpan],
        newTimeSpan
      )
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/details';
</style>
