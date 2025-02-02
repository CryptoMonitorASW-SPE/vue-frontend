<template>
  <nav :class="['navbar', { 'dark-mode': isDarkMode }]" class="navbar navbar-expand-lg">
    <div class="container-fluid d-flex align-items-center">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand">
        <div class="logo" role="heading" aria-level="1">CryptoMonitor</div>
      </RouterLink>

      <!-- Toggle Button per Mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu di Navigazione -->
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" aria-current="page">Coins</RouterLink>
          </li>
          <li class="nav-item d-flex align-items-center">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
        </ul>

        <!-- Sezione Search, Sign In e Toggle Dark Mode -->
        <form class="d-flex align-items-center">
          <CurrencyToggle class="currency" @currency-changed="handleCurrencyChange" />
          <div class="me-3">
            <label for="search" class="visually-hidden">Search cryptocurrencies</label>
            <input
              id="search"
              type="search"
              class="form-control"
              placeholder="Search..."
              aria-label="Search cryptocurrencies"
            />
          </div>
          <RouterLink v-if="isAuthenticated" to="/profile" class="btn btn-primary me-3"
            >Profile</RouterLink
          >
          <RouterLink v-if="isAuthenticated" to="/wallet" class="btn btn-primary me-3"
            >Wallet</RouterLink
          >
          <RouterLink v-if="isAuthenticated" to="/watchlist" class="btn btn-primary me-3"
            >Watchlist</RouterLink
          >
          <RouterLink v-if="!isAuthenticated" to="/login" class="btn btn-primary me-3"
            >Sign In</RouterLink
          >
          <button v-else class="btn btn-primary me-3" @click="logout">Logout</button>
          <ThemeToggle :isDarkMode="isDarkMode" @toggle-dark-mode="handleToggleDarkMode" />
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'
import CurrencyToggle from './CurrencyToggle.vue'

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
    }
  }
  
}
</script>

<style lang="scss">
@use '../assets/scss/base' as base;
@use 'sass:map';
@use 'sass:color';

/* Navbar */
.navbar {
  background-color: map.get(base.$light-theme, navbar-background);
  box-shadow: base.$box-shadow;
  padding: base.$padding-sm base.$padding-sm;
  margin-bottom: base.$padding-sm;
  height: 60px;

  .dark-mode & {
    background-color: map.get(base.$dark-theme, navbar-background);
  }

  .navbar-brand {
    display: flex;
    align-items: center;

    .logo {
      font-weight: bold;
      font-size: base.$font-size-xl;
      margin-bottom: base.$padding-sm;
      color: map.get(base.$light-theme, text-color);

      .dark-mode & {
        color: map.get(base.$dark-theme, text-color);
      }
    }
  }

  .nav-link {
    color: map.get(base.$light-theme, text-color);
    transition: color 0.2s ease;

    &.active,
    &:hover {
      color: map.get(base.$light-theme, text-color);
    }

    .dark-mode & {
      color: map.get(base.$dark-theme, text-color);

      &:hover,
      &:focus-visible {
        color: base.$primary-color;
        @include base.focus-visible;
      }
    }
  }

  .currency {
    color: map.get(base.$light-theme, text-color);

    .dark-mode & {
      color: map.get(base.$dark-theme, text-color);
    }
  }

  .form-control {
    width: 100%;
    padding: base.$padding-sm;
    background-color: map.get(base.$light-theme, secondary-color);
    color: map.get(base.$light-theme, 'text-color');
    border: 1px solid #ccc;
    border-radius: base.$border-radius;

    .dark-mode & {
      background-color: map.get(base.$dark-theme, secondary-color);
    }

    &:focus {
      @include base.focus-visible;
      border-color: base.$primary-color;
      box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
    }
  }

  .btn-primary {
    @include base.touch-target;
    background-color: base.$primary-color;
    color: white;
    border: none;
    padding: base.$padding-sm base.$padding-md;
    border-radius: base.$border-radius;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      background-color: color.adjust(base.$primary-color, $lightness: -10%);
    }

    &:focus-visible {
      @include base.focus-visible;
    }

    &[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

@media (min-width: 768px) {
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

  .btn-primary {
    width: auto;
  }

  .input-group {
    width: 250px;
  }
}

@media (min-width: 1024px) {
  .navbar {
    padding: base.$padding-lg base.$padding-lg;

    .logo {
      font-size: base.$font-size-xl;
    }
  }
}
</style>
