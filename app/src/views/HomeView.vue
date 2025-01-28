<template>
  <div class="home-view">
    <Navbar />
    <main class="hero" style="margin-left: 2rem; margin-right: 2rem">
      <section>
        <h1>Welcome to CryptoMonitor</h1>
        <p>Your go-to platform for the first approach to the cryptocurrency market.</p>
        <button class="cta">Get Started</button>
      </section>
    </main>
    <section style="margin-left: 2rem; margin-right: 2rem; margin-top: 2rem">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h3>Top Cryptocurrencies</h3>
        <button class="filter-btn" @click="openFilterModal">Filter</button>
      </div>
      <FilterModal
        :isVisible="isFilterModalVisible"
        :filters="filters"
        @apply-filters="applyFilters"
        @close="closeFilterModal"
      />
      <CryptoTable :filters="filters" />
    </section>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import CryptoTable from '../components/CryptoTable.vue'
import { initializeSocket } from '../controllers/socketioController'
import FilterModal from '../components/modals/FilterModal.vue'

export default {
  name: 'HomeView',
  components: {
    Navbar,
    Footer,
    CryptoTable,
    FilterModal
  },
  data() {
    return {
      isFilterModalVisible: false,
      filters: {
        minPrice: null,
        maxPrice: null,
        change24h: null
      }
    }
  },
  mounted() {
    initializeSocket()
  },
  methods: {
    openFilterModal() {
      this.isFilterModalVisible = true
    },
    closeFilterModal() {
      this.isFilterModalVisible = false
    },
    applyFilters(newFilters) {
      this.filters = newFilters
      this.closeFilterModal()
      console.log('Filters applied:', this.filters)
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/home';
</style>
