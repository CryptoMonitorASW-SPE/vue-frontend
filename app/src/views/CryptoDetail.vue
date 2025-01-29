<template>
  <div class="container my-4">
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
      <div class="col-12 col-md-3">
        <MarketDataBoxes />
      </div>
      <div class="col-12 col-md-6">
        <ChartComponent v-if="crypto.id" :cryptoId="crypto.id" :currency="userCurrency" />
      </div>
      <div class="col-12 col-md-3">
        <MarketDataBoxes />
      </div>
    </div>
  </div>
</template>

<script>
import CryptoHeader from '../components/details/CryptoHeader.vue'
import CryptoPrice from '../components/details/CryptoPrice.vue'
import ChartComponent from '../components/details/CryptoOHLChart.vue'
import { useCryptoStore } from '../stores/CryptoStore'
import MarketDataBoxes from '../components/details/MarketDataBoxes.vue'

export default {
  name: 'CryptoDetail',
  components: {
    CryptoHeader,
    CryptoPrice,
    ChartComponent,
    MarketDataBoxes
  },
  props: {
    cryptoId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      crypto: {},
      isFavorite: false,
      userCurrency: 'USD' // Default currency; you can wire this up to user prefs
    }
  },
  async mounted() {
    const cryptoStore = useCryptoStore()
    this.crypto = await cryptoStore.fetchCryptoById(this.cryptoId)
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    }
  }
}
</script>
