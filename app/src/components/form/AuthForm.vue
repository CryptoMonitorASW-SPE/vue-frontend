<template>
  <div class="card mx-auto auth-form">
    <div class="card-body">
      <h1 class="card-title text-center mb-4">{{ title }}</h1>
      <form aria-label="Authentication Form" @submit.prevent="handleSubmit">
        <div class="mb-3 form-group">
          <label :for="emailId" class="form-label">Email</label>
          <input
            :id="emailId"
            v-model="form.email"
            type="email"
            placeholder="Enter your email address"
            required
            aria-required="true"
            autocomplete="username"
            class="form-control"
          />
        </div>
        <div class="mb-3 form-group">
          <label :for="passwordId" class="form-label">Password</label>
          <input
            :id="passwordId"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
            aria-required="true"
            autocomplete="current-password"
            class="form-control"
          />
        </div>
        <button type="submit" :disabled="!isValidForm" class="btn btn-primary w-100">
          {{ buttonText }}
        </button>
        <slot></slot>
        <div aria-live="polite" class="sr-only">
          {{ isValidForm ? 'Form ready' : 'Please fill out the form' }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from 'vue'

export default {
  name: 'AuthForm',
  props: {
    title: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = reactive({
      email: '',
      password: ''
    })

    const isValidForm = computed(() => {
      return form.email.trim() !== '' && form.password.trim() !== ''
    })

    const handleSubmit = () => {
      if (isValidForm.value) {
        console.log('Emitting form-submit with data:', { ...form })
        emit('form-submit', { ...form })
      }
    }

    const emailId = computed(() => `email-${Math.random().toString(36).slice(2, 9)}`)
    const passwordId = computed(() => `password-${Math.random().toString(36).slice(2, 9)}`)

    return {
      form,
      isValidForm,
      handleSubmit,
      emailId,
      passwordId
    }
  }
}
</script>
