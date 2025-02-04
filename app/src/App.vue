<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useCryptoStore } from '@/stores/CryptoStore'

const cryptoStore = useCryptoStore()

onMounted(() => {
  cryptoStore.initializeSocket()
})

onUnmounted(() => {
  cryptoStore.cleanup()
})
</script>
