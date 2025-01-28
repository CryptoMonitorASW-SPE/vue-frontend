<template>
  <header class="navbar">
    <div class="navbar-left">
      <div class="logo" role="heading" aria-level="1">CryptoMonitor</div>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="#" aria-current="page">Coins</a></li>
          <li><a href="#">Exchanges</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
    <div class="search-signin">
      <div class="search-container">
        <label for="search" class="sr-only">Search cryptocurrencies</label>
        <input
          id="search"
          type="search"
          class="search-bar"
          placeholder="Search..."
          aria-label="Search cryptocurrencies"
        />
      </div>
      <RouterLink to="/Login" class="sign-in" role="button">Sign In</RouterLink>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>
