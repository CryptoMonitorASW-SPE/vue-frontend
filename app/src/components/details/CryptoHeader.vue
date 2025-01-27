<template>
  <header class="crypto-header">
    <img :src="image" :alt="`Logo di ${name}`" class="crypto-image" />
    <div class="crypto-info">
      <h1>{{ name }} ({{ symbol }})</h1>
      <p>Rank #{{ rank }}</p>
    </div>
    <button
      @click="$emit('toggle-favorite')"
      class="favorite-button"
      :aria-pressed="isFavorite"
      :aria-label="isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
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

<style lang="scss" src="../styles/CryptoHeader.scss"></style>
