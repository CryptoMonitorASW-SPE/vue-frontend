<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <p><strong>Name:</strong> {{ user.name }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

export default {
  name: 'ProfileView',
  setup() {
    const authStore = useAuthenticationStore()

    const user = computed(() => authStore.user)

    const handleLogout = () => {
      authStore.logout()
      // Redirect to Home after logout
      authStore.router.push({ name: 'Home' })
    }

    return {
      user,
      handleLogout
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #ffffff;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  margin: 10px 0;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #c82333;
}
</style>
