<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCryptoStore } from '@/store/CryptoStore'

const toast = useToast()
const cryptoStore = useCryptoStore()

function handleUserSpecificEvent(event) {
  const data = event.detail
  toast.success(`${data.message}`, {
    timeout: 5000
  })
}

onMounted(() => {
  cryptoStore.initializeSocket()
  window.addEventListener('user-specific-event', handleUserSpecificEvent)
})

onUnmounted(() => {
  cryptoStore.cleanup()
  window.removeEventListener('user-specific-event', handleUserSpecificEvent)
})
</script>
