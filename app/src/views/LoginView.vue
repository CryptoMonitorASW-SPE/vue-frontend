<template>
  <main class="container d-flex justify-content-center align-items-center">
    <div class="w-100" style="max-width: 400px">
      <AuthForm title="Welcome Back!" buttonText="Login" @form-submit="submitForm">
        <div class="form-footer text-center mt-3">
          <p>
            Don't have an account?
            <RouterLink to="/signup">Join us!</RouterLink>
          </p>
        </div>
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
      </AuthForm>
    </div>
  </main>
</template>

<script>
import { useRouter } from 'vue-router'
import AuthForm from '@/components/forms/AuthForm.vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

export default {
  name: 'LoginView',
  components: {
    AuthForm,
    RouterLink
  },
  setup() {
    const authStore = useAuthenticationStore()
    const { error } = storeToRefs(authStore)
    const router = useRouter()

    const submitForm = async formData => {
      console.log('formData', formData)
      const data = {
        email: formData.email,
        password: formData.password
      }
      await authStore.login(data)
      if (!error.value) {
        router.push('/')
      }
    }

    return {
      error,
      submitForm
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/auth';
</style>
