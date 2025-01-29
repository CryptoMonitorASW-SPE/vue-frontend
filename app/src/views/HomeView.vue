<template>
  <section class="hero">
    <h1>Welcome to CryptoMonitor</h1>
    <p>Your go-to platform for the first approach to the cryptocurrency market.</p>
    <button class="cta btn btn-primary">Get Started</button>
  </section>

  <section class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Top Cryptocurrencies</h3>
      <button class="filter-btn btn btn-primary" @click="openFilterModal">Filter</button>
    </div>
    <FilterModal
      :isVisible="isFilterModalVisible"
      :filters="filters"
      @apply-filters="applyFilters"
      @close="closeFilterModal"
    />
    <CryptoTable :filters="filters" />
  </section>
</template>

<script>
import CryptoTable from '../components/CryptoTable.vue'
import FilterModal from '../components/modals/FilterModal.vue'
import { initializeSocket } from '../controllers/socketioController'

export default {
  name: 'HomeView',
  components: {
    FilterModal,
    CryptoTable
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
