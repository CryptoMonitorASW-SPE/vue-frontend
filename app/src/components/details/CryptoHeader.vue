<template>
  <header class="crypto-header d-flex flex-column align-items-center text-center">
    <img :src="image" :alt="`Logo di ${name}`" class="crypto-image mb-3" />
    <div class="crypto-info">
      <h1>{{ name }} ({{ symbol }})</h1>
      <p>Rank #{{ rank }}</p>
    </div>
    <button
      class="favorite-button mt-3"
      :aria-pressed="isFavorite"
      :aria-label="isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
      @click="$emit('toggle-favorite')"
    >
      <span v-if="isFavorite">★</span>
      <span v-else>☆</span>
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
    isFavorite: {
      type: Boolean,
      required: true
    }
  }
}
</script>
