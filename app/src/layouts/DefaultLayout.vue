<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="d-flex flex-column min-vh-100">
    <header class="main-header">
      <Navbar :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    </header>

    <main class="flex-grow-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark-mode')
  }
})
</script>
