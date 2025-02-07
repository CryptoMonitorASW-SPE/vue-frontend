<template>
  <section class="crypto-price">
    <h2>Current Price</h2>
    <p>{{ formattedPrice }}</p>
  </section>
</template>

<script>
export default {
  name: 'CryptoPrice',
  props: {
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      validator: value => ['USD', 'EUR'].includes(value)
    }
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency
      }).format(this.price)
    }
  }
}
</script>
