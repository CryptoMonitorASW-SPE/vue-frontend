<template>
  <section class="crypto-exchanges">
    <h2>Exchange Disponibili</h2>
    <ul>
      <li v-for="exchange in exchanges" :key="exchange.id">
        {{ exchange.name }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'CryptoExchanges',
  props: {
    exchanges: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" src="../styles/CryptoExchanges.scss"></style>
