<template>
  <div
    id="offcanvasNavbar"
    class="offcanvas offcanvas-start d-lg-none"
    tabindex="-1"
    aria-labelledby="offcanvasNavbarLabel"
  >
    <div class="offcanvas-header">
      <h5 id="offcanvasNavbarLabel" class="offcanvas-title">Menu</h5>
      <button type="button" class="btn-close" aria-label="Close" @click="closeOffcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <!-- Navigation Links -->
      <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" aria-current="page" @click="closeOffcanvas">
            Coins<i class="bi bi-coin ms-1"></i>
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link" @click="closeOffcanvas">
            About<i class="bi bi-question-circle ms-1"></i>
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li v-if="isAuthenticated" class="nav-item">
          <RouterLink to="/profile" class="nav-link" @click="closeOffcanvas">
            Profile<i class="bi bi-person-circle ms-1"></i>
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li v-if="isAuthenticated" class="nav-item">
          <RouterLink to="/wallet" class="nav-link" @click="closeOffcanvas">
            Wallet<i class="bi bi-wallet2 ms-1"></i>
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li v-if="isAuthenticated" class="nav-item">
          <RouterLink to="/watchlist" class="nav-link" @click="closeOffcanvas">
            Watchlist<i class="bi bi-star-fill ms-1"></i>
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider" /></li>
      </ul>

      <!-- Sign In / Logout / Toggles -->
      <form class="d-flex flex-column align-items-stretch mt-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center">
            <legend class="me-2 mb-0">Currency:</legend>
            <CurrencyToggle class="currency" @currency-changed="emitCurrencyChange" />
          </div>
          <div class="d-flex align-items-center">
            <legend class="me-2 mb-0">Theme:</legend>
            <ThemeToggle :isDarkMode="isDarkMode" @toggle-dark-mode="emitToggleDarkMode" />
          </div>
        </div>
        <div v-if="!isAuthenticated" class="mb-2">
          <RouterLink to="/login" class="btn btn-primary w-100" @click="closeOffcanvas">
            Sign In
          </RouterLink>
        </div>
        <div v-else class="mb-2">
          <button type="button" class="btn btn-primary w-100" @click="handleLogout">
            <i class="bi bi-box-arrow-left me-1"></i>Logout
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'
import CurrencyToggle from './CurrencyToggle.vue'

export default {
  name: 'NavbarOffcanvas',
  components: {
    ThemeToggle,
    CurrencyToggle
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    }
  },
  emits: ['logout', 'currency-changed', 'toggle-dark-mode'],
  methods: {
    closeOffcanvas() {
      const offcanvasEl = document.getElementById('offcanvasNavbar')
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      } else {
        const newOffcanvasInstance = new bootstrap.Offcanvas(offcanvasEl)
        newOffcanvasInstance.hide()
      }
    },
    handleLogout() {
      this.emitLogout()
      this.closeOffcanvas()
    },
    emitLogout() {
      this.$emit('logout')
    },
    emitCurrencyChange(newCurrency) {
      this.$emit('currency-changed', newCurrency)
    },
    emitToggleDarkMode() {
      this.$emit('toggle-dark-mode')
    }
  }
}
</script>

<style scoped>
.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
legend {
  font-size: 1rem;
  font-weight: 500;
}
</style>
