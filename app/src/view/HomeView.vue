<template>
  <section v-if="!isAuthenticated" class="hero">
    <h1>Welcome to CryptoMonitor</h1>
    <p>Your go-to platform for the first approach to the cryptocurrency market.</p>
    <RouterLink to="/signup" class="cta btn btn-primary">Get Started</RouterLink>
  </section>

  <section class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Top Cryptocurrencies</h1>
      <div class="d-flex align-items-center">
        <div class="me-2">
          <label for="search-desktop" class="visually-hidden">Search cryptocurrencies</label>
          <div class="input-group">
            <input
              id="search-desktop"
              v-model="searchQuery"
              type="search"
              class="form-control"
              placeholder="Search..."
              aria-label="Search cryptocurrencies"
            />
          </div>
        </div>
        <button class="filter-btn btn btn-primary" @click="openFilterModal">
          <i class="bi bi-filter-right me-1"></i>Filter
        </button>
        <div class="d-flex align-items-center">
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
    <FilterModal
      :isVisible="isFilterModalVisible"
      :filters="filters"
      @apply-filters="applyFilters"
      @close="closeFilterModal"
    />
    <CryptoTable :filters="filters" :searchQuery="searchQuery" />
  </section>
</template>

<script>
import CryptoTable from '../components/home/CryptoTable.vue'
import FilterModal from '../components/home/FilterModal.vue'
import { useAuthenticationStore } from '@/store/AuthenticationStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'HomeView',
  components: {
    FilterModal,
    CryptoTable
  },
  setup() {
    const authStore = useAuthenticationStore()
    const { isAuthenticated } = storeToRefs(authStore)

    return {
      isAuthenticated
    }
  },
  data() {
    return {
      isFilterModalVisible: false,
      searchQuery: '',
      filters: {
        minPrice: null,
        maxPrice: null,
        change24h: null
      }
    }
  },
  mounted() {},
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
