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
      <!-- Header Row -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <CryptoHeader
            :image="crypto.image"
            :name="crypto.name"
            :symbol="crypto.symbol"
            :rank="crypto.rank"
            :isFavorite="isFavorite"
            @toggle-favorite="toggleFavorite"
          />
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12 col-md-3 mt-2">
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
          <ChartComponent
            :cryptoId="crypto.id"
            :currency="userCurrency"
            :chartData="activeChartData"
            :loading="chartLoading"
            @timeframe-change="handleTimeframeChange"
          />
        </div>
        <div class="col-12 col-md-3 mt-2">
          <!-- <AdditionalInfoPanel :details="additionalDetails" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCryptoDetailStore } from '../stores/CryptoDetailStore'
import { useCryptoStore } from '../stores/CryptoStore'
import CryptoHeader from '../components/details/CryptoHeader.vue'
import ChartComponent from '../components/details/CryptoOHLChart.vue'
import MarketDataBoxes from '../components/details/MarketDataBoxes.vue'

export default {
  name: 'CryptoDetail',
  components: {
    CryptoHeader,
    ChartComponent,
    MarketDataBoxes
  },
  props: {
    cryptoId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const storeDetail = useCryptoDetailStore()
    const storeCrypto = useCryptoStore()
    const userCurrency = 'USD' // Could be moved to a user preferences store
    const crypto = computed(() => storeCrypto.fetchCryptoById(props.cryptoId))
    // Initial data fetch
    storeDetail.fetchInitialData(props.cryptoId, userCurrency, {
      days: 7, // Default to 1 week
      timeSpan: '1W'
    })
    console.log(crypto.value)
    return {
      crypto,
      userCurrency,
      //cryptoDetails: computed(() => storeDetail.cryptoDetails),
      // marketData: computed(() => ({
      //   price: storeDetail.cryptoDetails?.currentPrice,
      //   marketCap: storeDetail.cryptoDetails?.marketCap,
      //   volume: storeDetail.cryptoDetails?.totalVolume,
      //   supply: storeDetail.cryptoDetails?.circulatingSupply
      // })),
      activeChartData: computed(() => storeDetail.chartData[storeDetail.activeTimeSpan]),
      initialLoading: computed(() => !storeDetail.initialLoadComplete),
      chartLoading: computed(() => storeDetail.isLoading),
      initialError: computed(() => storeDetail.errorDetails || storeDetail.error)
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
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
        this.userCurrency,
        daysMap[newTimeSpan],
        newTimeSpan
      )
    }
  }
}
</script>
