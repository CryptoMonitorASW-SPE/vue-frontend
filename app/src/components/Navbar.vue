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
      <NavbarOffcanvas
        :isDarkMode="isDarkMode"
        :isAuthenticated="isAuthenticated"
        @logout="logout"
        @currency-changed="handleCurrencyChange"
        @toggle-dark-mode="handleToggleDarkMode"
      />

      <!-- Desktop Navigation (visible on large screens) -->
      <div class="collapse navbar-collapse d-none d-lg-flex justify-content-between">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" aria-current="page"
              >Coins<i class="bi bi-coin ms-1"></i
            ></RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link"
              >About<i class="bi bi-question-circle ms-1"></i
            ></RouterLink>
          </li>
        </ul>
        <form class="d-flex align-items-center">
          <CurrencyToggle class="currency me-2" @currency-changed="handleCurrencyChange" />
          <div class="d-flex">
            <RouterLink v-if="isAuthenticated" to="/wallet" class="btn btn-primary me-3"
              ><i class="bi bi-wallet2 me-1"></i>Wallet</RouterLink
            >
            <RouterLink v-if="isAuthenticated" to="/watchlist" class="btn btn-primary me-3"
              ><i class="bi bi-star-fill me-1"></i>Watchlist</RouterLink
            >
            <div v-if="isAuthenticated" class="dropdown">
              <a
                href="#"
                class="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User account menu"
              >
                <i class="bi bi-person-vcard profile-icon"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <RouterLink to="/profile" class="dropdown-item"
                    >Your Profile<i class="bi bi-person-circle ms-1"></i
                  ></RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a href="#" class="dropdown-item" @click="logout"
                    >Logout<i class="bi bi-box-arrow-left ms-1"></i
                  ></a>
                </li>
              </ul>
            </div>
            <RouterLink v-if="!isAuthenticated" to="/login" class="btn btn-primary me-2"
              >Sign In</RouterLink
            >
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
import NavbarOffcanvas from './NavbarOffcanvas.vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'Navbar',
  components: {
    ThemeToggle,
    CurrencyToggle,
    NavbarOffcanvas
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
  border-radius: base.$border-radius;

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
@media (min-width: 991px) {
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
  .profile-icon {
    color: map.get(base.$light-theme, text-color);
    transition: color 0.2s ease;
    font-size: 2.5rem;
    line-height: 1;
    .dark-mode & {
      color: map.get(base.$dark-theme, text-color);
    }
  }

  .dropdown-menu {
    background-color: map.get(base.$light-theme, navbar-background);
    border: 1px solid map.get(base.$light-theme, border-color);
    box-shadow: base.$box-shadow;
    .dropdown-item {
      color: map.get(base.$light-theme, text-color);
      &:hover {
        background-color: map.get(base.$light-theme, hover-color);
      }
    }
    .dark-mode & {
      background-color: map.get(base.$dark-theme, navbar-background);
      border-color: map.get(base.$dark-theme, border-color);
      .dropdown-item {
        color: map.get(base.$dark-theme, text-color);
        &:hover {
          background-color: map.get(base.$dark-theme, secondary-color);
        }
      }
    }
  }
}
</style>
