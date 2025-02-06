<template>
  <footer class="footer mt-auto py-3">
    <h4>CryptoMonitor</h4>
    <div class="d-flex justify-content-between align-items-center container-fluid px-0">
      <p class="mb-0">CryptoMonitor offers the best approach to the cryptocurrency market.</p>
      <!-- Utilizzo ms-3 (margin-start) per avere solo lo spazio tra i paragrafi -->
      <p class="mb-0 ms-3">&copy; 2025 CryptoMonitor.</p>
    </div>
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

  .text-right {
    color: map.get(base.$light-theme, text-color);
  }

  p {
    margin: 0;
    color: map.get(base.$light-theme, text-color);
    .dark-mode & {
      color: map.get(base.$dark-theme, text-color);
    }
  }

  .dark-mode & {
    background-color: map.get(base.$dark-theme, navbar-background);

    .text-right {
      color: map.get(base.$dark-theme, text-color);
    }
  }
}
</style>
