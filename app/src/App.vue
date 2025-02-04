<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCryptoStore } from '@/stores/CryptoStore'

const toast = useToast()
const cryptoStore = useCryptoStore()

// Handler for the custom event
function handleUserSpecificEvent(event) {
  const data = event.detail
  // Customize the toast content as needed. Here we assume data has a "message" property.
  toast(`${data.message}`, {
    timeout: 5000
    // additional toast options if needed
  })
  toast.info(`${data.message}`, {
    timeout: 10000
  })
}

onMounted(() => {
  // Initialize the socket connection
  cryptoStore.initializeSocket()
  // Add the event listener for our custom event.
  window.addEventListener('user-specific-event', handleUserSpecificEvent)
})

onUnmounted(() => {
  cryptoStore.cleanup()
  window.removeEventListener('user-specific-event', handleUserSpecificEvent)
})
</script>
