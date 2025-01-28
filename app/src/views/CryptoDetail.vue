<template>
  <article class="crypto-detail">
    <CryptoHeader
      :image="crypto.image"
      :name="crypto.name"
      :symbol="crypto.symbol"
      :rank="crypto.rank"
      :isFavorite="isFavorite"
      @toggle-favorite="toggleFavorite"
    />
    <CryptoPrice :price="crypto.price" :currency="userCurrency" />
    <section class="crypto-chart">
      <h2>Price Trend</h2>
      <ChartComponent :cryptoId="crypto.id" />
    </section>
    <CryptoExchanges :exchanges="exchanges" />
  </article>
</template>

<script>
import CryptoHeader from '../components/details/CryptoHeader.vue'
import CryptoPrice from '../components/details/CryptoPrice.vue'
//import CryptoExchanges from '../components/details/CryptoExchanges.vue'
import ChartComponent from '../components/details/CryptoOHLChart.vue'
import { useCryptoStore } from '../stores/CryptoStore'

export default {
  name: 'CryptoDetail',
  components: {
    CryptoHeader,
    CryptoPrice,
    //CryptoExchanges,
    ChartComponent
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
      exchanges: [],
      userCurrency: 'USD' // Default currency; this can be dynamically set based on user preference
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

<style lang="scss">
@use '../assets/scss/details';
</style>
