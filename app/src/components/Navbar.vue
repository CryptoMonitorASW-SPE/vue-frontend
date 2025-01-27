<template>
  <header class="navbar">
    <div class="navbar-left">
      <div class="logo">CryptoMonitor</div>
      <nav>
        <ul style="align-self: start">
          <li><a href="#">Coins</a></li>
          <li><a href="#">Exchanges</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
    <div class="search-signin">
      <input type="text" class="search-bar" placeholder="Search..." />
      <RouterLink to="/Login" class="sign-in">Sign In</RouterLink>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>
