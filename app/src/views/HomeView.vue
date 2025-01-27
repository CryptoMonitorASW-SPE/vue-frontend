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
    <section style="margin-left: 2rem; margin-right: 2rem">
      <h3>Top Cryptocurrencies</h3>
      <CryptoTable />
    </section>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import CryptoTable from '../components/CryptoTable.vue'
import { initializeSocket } from '../controllers/socketioController'

export default {
  name: 'HomeView',
  components: {
    Navbar,
    Footer,
    CryptoTable
  },
  mounted() {
    initializeSocket()
  }
}
</script>

<style lang="scss">
@use '../assets/scss/home';
</style>
