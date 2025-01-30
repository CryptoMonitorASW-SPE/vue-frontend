<template>
  <div class="dropdown">
    <button
      id="currencyDropdown"
      class="btn btn-white dropdown-toggle"
      data-bs-display="static"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ selectedCurrency }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="currencyDropdown">
      <li>
        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('USD')"> USD </a>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('EUR')"> EUR </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { useCryptoStore } from '@/stores/CryptoStore'

export default {
  name: 'CurrencyToggle',
  data() {
    return {
      selectedCurrency: 'USD'
    }
  },
  mounted() {
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      this.selectedCurrency = savedCurrency
      const cryptoStore = useCryptoStore()
      cryptoStore.setCurrency(savedCurrency)
    }
  },
  methods: {
    selectCurrency(currency) {
      this.selectedCurrency = currency
      const cryptoStore = useCryptoStore()
      cryptoStore.setCurrency(currency)
    }
  }
}
</script>
<style scoped>
.dropdown {
  margin-right: 1rem;
}

.btn.dropdown-toggle {
  color: inherit;
  border: none;
}
</style>
