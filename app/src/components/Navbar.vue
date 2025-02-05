<template>
  <nav :class="['navbar', { 'dark-mode': isDarkMode }]" class="navbar navbar-expand-lg">
    <div class="container-fluid d-flex flex-wrap align-items-center">
      <!-- Mobile Offcanvas Toggle (visible on small screens) -->
      <button
        class="navbar-toggler d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Logo (always visible) -->
      <RouterLink to="/" class="navbar-brand">
        <div class="logo" role="heading" aria-level="1">CryptoMonitor</div>
      </RouterLink>

      <!-- Offcanvas Menu for Mobile -->
      <div
        id="offcanvasNavbar"
        class="offcanvas offcanvas-start d-lg-none"
        tabindex="-1"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5 id="offcanvasNavbarLabel" class="offcanvas-title">Menu</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <!-- Navigation Links -->
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" aria-current="page">Coins</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" class="nav-link">About</RouterLink>
            </li>
          </ul>

          <!-- Search & User Actions -->
          <form class="d-flex flex-column align-items-stretch mt-3">
            <CurrencyToggle class="currency mb-2" @currency-changed="handleCurrencyChange" />
            <div class="mb-2">
              <label for="search-mobile" class="visually-hidden">Search cryptocurrencies</label>
              <input
                id="search-mobile"
                type="search"
                class="form-control"
                placeholder="Search..."
                aria-label="Search cryptocurrencies"
              />
            </div>
            <div class="mb-2">
              <RouterLink v-if="isAuthenticated" to="/profile" class="btn btn-primary w-100"
                >Profile</RouterLink
              >
            </div>
            <div v-if="isAuthenticated" class="mb-2">
              <RouterLink to="/wallet" class="btn btn-primary w-100">Wallet</RouterLink>
            </div>
            <div v-if="isAuthenticated" class="mb-2">
              <RouterLink to="/watchlist" class="btn btn-primary w-100">Watchlist</RouterLink>
            </div>
            <div v-if="!isAuthenticated" class="mb-2">
              <RouterLink to="/login" class="btn btn-primary w-100">Sign In</RouterLink>
            </div>
            <div v-else class="mb-2">
              <button type="button" class="btn btn-primary w-100" @click="logout">Logout</button>
            </div>
            <ThemeToggle
              :isDarkMode="isDarkMode"
              class="mt-2"
              @toggle-dark-mode="handleToggleDarkMode"
            />
          </form>
        </div>
      </div>

      <!-- Desktop Navigation (visible on large screens) -->
      <div class="collapse navbar-collapse d-none d-lg-flex justify-content-between">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" aria-current="page">Coins</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
        </ul>
        <form class="d-flex align-items-center">
          <CurrencyToggle class="currency me-2" @currency-changed="handleCurrencyChange" />
          <div class="me-2">
            <label for="search-desktop" class="visually-hidden">Search cryptocurrencies</label>
            <input
              id="search-desktop"
              type="search"
              class="form-control"
              placeholder="Search..."
              aria-label="Search cryptocurrencies"
            />
          </div>
          <div class="d-flex">
            <RouterLink v-if="isAuthenticated" to="/profile" class="btn btn-primary me-2"
              >Profile</RouterLink
            >
            <RouterLink v-if="isAuthenticated" to="/wallet" class="btn btn-primary me-2"
              >Wallet</RouterLink
            >
            <RouterLink v-if="isAuthenticated" to="/watchlist" class="btn btn-primary me-2"
              >Watchlist</RouterLink
            >
            <RouterLink v-if="!isAuthenticated" to="/login" class="btn btn-primary me-2"
              >Sign In</RouterLink
            >
            <button v-else type="button" class="btn btn-primary me-2" @click="logout">
              Logout
            </button>
          </div>
          <ThemeToggle
            :isDarkMode="isDarkMode"
            class="ms-2"
            @toggle-dark-mode="handleToggleDarkMode"
          />
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'
import CurrencyToggle from './CurrencyToggle.vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'Navbar',
  components: {
    ThemeToggle,
    CurrencyToggle
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const authStore = useAuthenticationStore()
    const { isAuthenticated } = storeToRefs(authStore)

    const logout = () => {
      authStore.logout()
    }

    return {
      isAuthenticated,
      logout
    }
  },
  methods: {
    handleToggleDarkMode() {
      this.$emit('toggle-dark-mode')
    },
    handleCurrencyChange(newCurrency) {
      this.$emit('currency-changed', newCurrency)
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/base' as base;
@use 'sass:map';
@use 'sass:color';

/* Navbar Base Styling */
.navbar {
  background-color: map.get(base.$light-theme, navbar-background);
  box-shadow: base.$box-shadow;
  padding: base.$padding-sm;
  margin-bottom: base.$padding-sm;
  position: relative;

  /* Dark Mode Adjustments */
  &.dark-mode {
    background-color: map.get(base.$dark-theme, navbar-background);
    /* Ensure mobile dropdown and nav links text are white */
    .navbar-brand,
    .nav-link {
      color: #ffffff !important;
    }
    // Offcanvas (mobile dropdown) styling
    .offcanvas {
      background-color: map.get(base.$dark-theme, navbar-background) !important;
      color: #ffffff !important;
    }
    /* Adjust mobile dropdown background if needed */
    .navbar-collapse {
      background-color: map.get(base.$dark-theme, navbar-background);
    }
    // Offcanvas header title
    .offcanvas-title {
      color: #ffffff;
    }
    .btn-close {
      filter: invert(1);
    }
    /* Dark mode for the mobile burger toggler icon */
    .navbar-toggler-icon {
      filter: invert(1);
    }
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    .logo {
      font-weight: bold;
      font-size: base.$font-size-xl;
      margin: 0;
      /* For dark mode, force logo text to white if not inherited */
      .dark-mode & {
        color: #ffffff;
      }
    }
  }
  /* Ensure the logo and buttons are legible in dark mode */
  .dark-mode {
    .navbar-brand .logo {
      color: map.get(base.$dark-theme, text-color) !important;
    }
    .nav-link,
    .btn-primary {
      color: #fff;
    }
  }

  /* Navigation Link Styling */
  .nav-link {
    color: map.get(base.$light-theme, text-color);
    transition: color 0.2s ease;

    &:hover,
    &.active {
      color: base.$primary-color;
    }
  }

  /* Form Input and Button Styles */
  .form-control {
    background-color: map.get(base.$light-theme, secondary-color);
    color: map.get(base.$light-theme, text-color);
    border: 1px solid #ccc;
    border-radius: base.$border-radius;

    &:focus {
      border-color: base.$primary-color;
      box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
    }
  }

  .btn-primary {
    background-color: base.$primary-color;
    color: #fff;
    border: none;
    padding: base.$padding-sm base.$padding-md;
    border-radius: base.$border-radius;
    cursor: pointer;

    &:hover {
      background-color: color.adjust(base.$primary-color, $lightness: -10%);
    }
  }
}

/* Ensure offcanvas appears above content */
.offcanvas {
  z-index: 1100;
}

/* Mobile First adjustments */
@media (min-width: 1024px) {
  .navbar-toggler {
    display: none;
  }
  .collapse.navbar-collapse {
    display: flex !important;
    align-items: center;
  }
  .form-control {
    width: 200px;
  }
  .navbar {
    height: 60px;
  }
}
</style>
