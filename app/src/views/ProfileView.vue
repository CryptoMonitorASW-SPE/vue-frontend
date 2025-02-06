<!-- filepath: /home/tone/university/SPE+WEB/bootstrap/src/vue-frontend/app/src/views/ProfileView.vue -->
<template>
  <div class="profile-view container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card p-4">
          <h2 class="mb-4">User Profile</h2>
          <!-- Keep your form logic (novalidate, @submit.prevent, etc.) -->
          <form novalidate @submit.prevent="saveProfile">
            <!-- First Name -->
            <div class="mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input
                id="firstName"
                v-model="profile.firstName"
                type="text"
                class="form-control"
                :disabled="!isEditing"
                placeholder="Enter your first name"
              />
            </div>
            <!-- Last Name -->
            <div class="mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                id="lastName"
                v-model="profile.lastName"
                type="text"
                class="form-control"
                :disabled="!isEditing"
                placeholder="Enter your last name"
              />
            </div>
            <!-- Date of Birth -->
            <div class="mb-3">
              <label for="dob" class="form-label">Date of Birth</label>
              <input
                id="dob"
                v-model="profile.dob"
                type="date"
                class="form-control"
                :disabled="!isEditing"
              />
            </div>
            <!-- Buttons -->
            <div class="d-flex justify-content-end mt-3">
              <button
                v-if="!isEditing"
                type="button"
                class="btn btn-primary me-2"
                @click="editProfile"
              >
                Edit
              </button>
              <button v-else type="submit" class="btn btn-success me-2">Save</button>
              <button v-if="isEditing" type="button" class="btn btn-danger" @click="cancelEdit">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProfileView',
  setup() {
    const userStore = useUserStore()
    const profile = ref({
      firstName: '',
      lastName: '',
      dob: ''
    })
    // Store the original profile values on load
    const originalProfile = ref({ ...profile.value })
    const isEditing = ref(false)

    onMounted(async () => {
      await userStore.getProfile()
      if (userStore.user) {
        // Map from endpoint fields to form fields.
        const mappedProfile = {
          firstName: userStore.user.name || '',
          lastName: userStore.user.surname || '',
          dob: userStore.user.dateOfBirth ? userStore.user.dateOfBirth.slice(0, 10) : ''
        }
        profile.value = mappedProfile
        originalProfile.value = { ...mappedProfile }
        console.log('[View] Mapped profile:', profile.value)
      }
    })

    const editProfile = () => {
      isEditing.value = true
    }

    const toast = useToast()
    const saveProfile = async () => {
      const success = await userStore.updateProfile(profile.value)
      if (success) {
        isEditing.value = false
        // Update originalProfile after successful save
        originalProfile.value = { ...profile.value }
        toast.success('Profile saved succesfully!')
      } else {
        toast.error('Profile could not be saved!')
      }
    }

    // Reset fields to original profile values on cancel
    const cancelEdit = () => {
      isEditing.value = false
      profile.value = { ...originalProfile.value }
    }

    return {
      profile,
      isEditing,
      editProfile,
      saveProfile,
      cancelEdit
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/profile';
</style>
