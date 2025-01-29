<template>
  <main class="signup-form">
    <div class="form-container">
      <AuthForm title="Join Us!" buttonText="Sign Up" @form-submit="submitForm">
        <div class="form-footer">
          <p>
            Already have an account?
            <RouterLink to="/login">Log in</RouterLink>
          </p>
        </div>
        <div v-if="error" class="error-message" role="alert">
          {{ error }}
        </div>
      </AuthForm>
    </div>
  </main>
</template>

<script>
import AuthForm from '@/components/forms/AuthForm.vue' // Corrected path
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'

export default {
  name: 'SignupView',
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
      await authStore.register(formData)
      if (!error.value) {
        router.push('/login') // Redirect to login after successful signup
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
@use '../assets/scss/register';
</style>
