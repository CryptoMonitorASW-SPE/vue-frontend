<template>
  <div class="theme-toggle">
    <label class="switch">
      <input :checked="isDarkMode" type="checkbox" @change="toggleTheme" />
      <span class="slider round"></span>
    </label>
    <span>{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
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
  gap: 0.5rem;
}

/* Switch CSS */
/* Fonte: https://www.w3schools.com/howto/howto_css_switch.asp */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
