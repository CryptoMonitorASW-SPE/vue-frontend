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
      <!-- Header Row  -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <CryptoHeader
            :image="crypto.image"
            :name="crypto.name"
            :symbol="crypto.symbol"
            :rank="crypto.marketCapRank"
            :isAuthenticated="isAuthenticated"
            :inWatchlist="isInWatchlist"
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
          <div class="d-flex align-items-center justify-content-end mt-2">
            <span class="me-2 mx-2">Data Powered by</span>
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              class="d-flex align-items-center"
            >
              <img
                src="../assets/img/coingecko-logo.png"
                alt="CoinGecko Logo"
                class="img-fluid"
                style="height: 30px"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCryptoDetailStore } from '../store/CryptoDetailStore'
import { useCryptoStore } from '../store/CryptoStore'
import { useAuthenticationStore } from '@/store/AuthenticationStore'
import { useWatchlistStore } from '../store/WatchlistStore'
import { useToast } from 'vue-toastification'

// Dynamic imports for components
const CryptoHeader = defineAsyncComponent(() => import('../components/detail/CryptoHeader.vue'))
const ChartComponent = defineAsyncComponent(() => import('../components/detail/CryptoOHLChart.vue'))
const MarketDataBoxes = defineAsyncComponent(
  () => import('../components/detail/MarketDataBoxes.vue')
)
const CryptoDetailsBoxes = defineAsyncComponent(
  () => import('../components/detail/CryptoDetailsBoxes.vue')
)

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

    const toast = useToast()

    const watchlistStore = useWatchlistStore()

    const isInWatchlist = ref(false)
    watchlistStore.isCryptoInWatchlist(cryptoId.value).then(inWatchlist => {
      isInWatchlist.value = inWatchlist
    })

    return {
      crypto,
      cryptoId,
      userCurrency,
      cryptoDetails: computed(() => storeDetail.cryptoDetails),
      initialLoading: computed(() => !storeDetail.initialLoadComplete),
      initialError: computed(() => storeDetail.errorDetails || storeDetail.error),
      isAuthenticated,
      toast,
      isInWatchlist
    }
  },
  methods: {
    async addToWatchlist() {
      const watchlistStore = useWatchlistStore()
      const added = await watchlistStore.addItem(this.cryptoId)
      if (added) {
        this.toast.success('Added to watchlist')
        this.isInWatchlist = true
      } else {
        this.toast.error('Error in inserting to watchlist')
      }
    },
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
