<template>
  <div class="container d-flex flex-column align-items-center justify-content-center">
    <div v-if="errorMessage" class="alert alert-danger w-100 text-center" role="alert">
      {{ errorMessage }} (Error Code: {{ errorCode }})
    </div>
    <div class="container d-flex justify-content-center mb-5">
      <div class="col-lg-8">
        <h1 class="display-4 fw-bold">About CryptoMonitor</h1>
        <p class="lead">
          CryptoMonitor is your premier platform for tracking cryptocurrency trends and obtaining
          deep insights into the digital financial world. Our mission is to empower users with
          real‑time market data and analytical tools.
        </p>
        <p class="lead">
          Whether you're a seasoned investor or just beginning your crypto journey, our intuitive
          interface ensure you always have the latest information at your fingertips.
        </p>
      </div>
    </div>
    <div class="container d-flex justify-content-center mb-5">
      <div class="col-md-4 mx-3">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <i class="bi bi-graph-up text-primary" style="font-size: 2.5rem"></i>
            <h5 class="card-title mt-3">Market Insights</h5>
            <p class="card-text">
              Access cutting-edge data and analytics to make informed investment decisions.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mx-3">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <i class="bi bi-headset text-primary" style="font-size: 2.5rem"></i>
            <h5 class="card-title mt-3">24/7 Support</h5>
            <p class="card-text">
              Our dedicated support team is always here to help you at every step of your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  props: {
    errorMessage: {
      type: String,
      default: ''
    },
    errorCode: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/base' as base;
@use 'sass:map';
@use 'sass:color';

.card-body {
  background-color: map.get(base.$light-theme, background-color);
  color: map.get(base.$light-theme, text-color);
  .dark-mode & {
    background-color: map.get(base.$dark-theme, navbar-background);
    color: map.get(base.$dark-theme, text-color);
  }
}
</style>
