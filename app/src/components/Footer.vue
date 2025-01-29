<template>
  <footer class="footer mt-auto py-3">
    <h4>CryptoMonitor</h4>
    <p>CryptoMonitor offers the best approach to the cryptocurrency market.</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss">
@use '../assets/scss/base' as base;
@use 'sass:map';
@use 'sass:color';

.footer {
  text-align: start;
  padding: base.$padding-md;
  background-color: map.get(base.$light-theme, navbar-background);
  margin-top: base.$padding-sm;

  p {
    margin: 0;
  }

  .dark-mode & {
    background-color: map.get(base.$dark-theme, navbar-background);
  }
}
</style>
