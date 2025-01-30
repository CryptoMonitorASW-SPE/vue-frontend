<template>
  <div class="theme-toggle">
    <button
      class="btn"
      :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      @click="toggleTheme"
    >
      <i :class="['bi', isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill', 'fs-4']"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ThemeToggle',
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleTheme() {
      this.$emit('update:isDarkMode', !this.isDarkMode)
      this.$emit('toggle-dark-mode')
    }
  }
}
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
}

.btn {
  padding: 0.5rem;
  color: inherit;
  transition: transform 0.3s ease;
}

.btn:hover {
  transform: scale(1.1);
}

.bi-sun-fill {
  color: #ffffff; /* Giallo sole */
}

.bi-moon-fill {
  color: #a8a9ad; /* Grigio luna */
}
</style>
