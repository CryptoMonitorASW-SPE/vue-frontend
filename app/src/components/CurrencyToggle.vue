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
      {{ cryptoStore.selectedCurrency }}
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

<script setup>
import { useCryptoStore } from '@/stores/CryptoStore'
const cryptoStore = useCryptoStore()

function selectCurrency(currency) {
  cryptoStore.setCurrency(currency)
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
