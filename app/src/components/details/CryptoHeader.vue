<template>
  <header class="crypto-header d-flex flex-column align-items-center text-center">
    <img :src="image" :alt="`Logo di ${name}`" class="crypto-image mb-3" />
    <div class="crypto-info">
      <h1>{{ name }} ({{ symbol }})</h1>
      <p>Rank #{{ rank }}</p>
    </div>
    <!-- Watchlist Button -->
    <button
      v-if="isAuthenticated"
      class="btn btn-outline-primary mt-3"
      aria-label="Add to Watchlist"
      @click="$emit('add-to-watchlist')"
    >
      <i class="bi bi-eye"></i> Add to Watchlist
    </button>
  </header>
</template>

<script>
export default {
  name: 'CryptoHeader',
  props: {
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    rank: {
      type: Number,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    isFavorite: {
      type: Boolean,
      required: true
    }
  }
}
</script>
