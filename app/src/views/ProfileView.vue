<template>
  <div class="profile-view container py-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4">
          <h2 class="mb-4">Profilo Utente</h2>
          <form @submit.prevent="saveProfile">
            <div class="mb-3">
              <label for="firstName" class="form-label">Nome</label>
              <input
                id="firstName"
                v-model="profile.firstName"
                type="text"
                class="form-control"
                :disabled="!isEditing"
              />
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">Cognome</label>
              <input
                id="lastName"
                v-model="profile.lastName"
                type="text"
                class="form-control"
                :disabled="!isEditing"
              />
            </div>
            <div class="mb-3">
              <label for="dob" class="form-label">Data di Nascita</label>
              <input
                id="dob"
                v-model="formattedDob"
                type="text"
                class="form-control"
                :disabled="!isEditing"
                placeholder="gg/mm/aaaa"
              />
            </div>
            <div class="d-flex justify-content-end mt-3">
              <button
                v-if="!isEditing"
                type="button"
                class="btn btn-primary me-2"
                @click="editProfile"
              >
                Edit
              </button>
              <button v-else type="submit" class="btn btn-success me-2">Salva</button>
              <button v-if="isEditing" type="button" class="btn btn-danger" @click="cancelEdit">
                Cancella
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'

export default {
  name: 'ProfileView',
  setup() {
    const userStore = useUserStore()
    const profile = ref({
      firstName: '',
      lastName: '',
      dob: ''
    })
    const isEditing = ref(false)

    onMounted(async () => {
      const success = await userStore.getProfile()
      if (success) {
        profile.value = {
          firstName: userStore.user.firstName,
          lastName: userStore.user.lastName,
          dob: userStore.user.dob
        }
      }
    })

    const editProfile = () => {
      isEditing.value = true
    }

    const saveProfile = async () => {
      try {
        const success = await userStore.updateProfile(profile.value)
        if (success) {
          isEditing.value = false
        }
      } catch (error) {
        console.error('Failed to save profile:', error)
      }
    }

    const cancelEdit = async () => {
      isEditing.value = false
      await userStore.getProfile()
      profile.value = {
        firstName: userStore.user.firstName,
        lastName: userStore.user.lastName,
        dob: userStore.user.dob
      }
    }

    const formattedDob = computed({
      get() {
        if (!profile.value.dob) return ''
        const date = new Date(profile.value.dob)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      },
      set(value) {
        const [day, month, year] = value.split('/')
        if (year && month && day) {
          profile.value.dob = `${year}-${month}-${day}`
        }
      }
    })

    return {
      profile,
      isEditing,
      editProfile,
      saveProfile,
      cancelEdit,
      formattedDob
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/profile' as profile;
</style>
