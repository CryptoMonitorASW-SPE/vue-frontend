<template>
  <div class="profile-view container py-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <!-- A Bootstrap card to display the profile -->
        <div class="card p-4">
          <h2 class="mb-4">Profilo Utente</h2>
          <form @submit.prevent="saveProfile">
            <!-- Nome -->
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
            <!-- Cognome -->
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
            <!-- Data di Nascita -->
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

            <!-- Buttons: Edit / Save / Cancel -->
            <div class="d-flex justify-content-end mt-3">
              <!-- Edit button (only visible if not editing) -->
              <button
                v-if="!isEditing"
                type="button"
                class="btn btn-primary me-2"
                @click="editProfile"
              >
                Edit
              </button>

              <!-- Save button (only visible if editing) -->
              <button v-else type="submit" class="btn btn-success me-2">Salva</button>

              <!-- Cancella button (only visible if editing) -->
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
//import axios from 'axios'

export default {
  name: 'ProfileView',
  setup() {
    // Profile data
    const profile = ref({
      firstName: '',
      lastName: '',
      dob: '' // We'll store it internally as YYYY-MM-DD
    })

    // A flag to control whether fields are editable
    const isEditing = ref(false)

    // Load data from API on mount (mocked for demonstration)
    onMounted(async () => {
      try {
        // Example of a real request:
        // const response = await axios.get('/api/profile');
        // profile.value = response.data;

        // For now, let's just mock the data:
        profile.value = {
          firstName: 'Mario',
          lastName: 'Rossi',
          // stored in ISO format
          dob: '1999-11-04'
        }
      } catch (error) {
        console.error('Failed to load profile data:', error)
      }
    })

    // When user clicks "Edit"
    const editProfile = () => {
      isEditing.value = true
    }

    // When user clicks "Salva"
    const saveProfile = async () => {
      try {
        // Convert from dd/mm/yyyy back to ISO if needed
        // and send to your API:
        // await axios.put('/api/profile', profile.value);

        // For this example, we’ll just log it:
        console.log('Saving profile', profile.value)

        isEditing.value = false
      } catch (error) {
        console.error('Failed to save profile:', error)
      }
    }

    // When user clicks "Cancella"
    const cancelEdit = async () => {
      // Typically, you'd re-fetch or revert the data from server to discard changes:
      try {
        // const response = await axios.get('/api/profile');
        // profile.value = response.data;

        // We'll just reset editing:
        isEditing.value = false
      } catch (error) {
        console.error('Failed to reload profile data:', error)
      }
    }

    // Computed property for date in Italian format (dd/mm/yyyy)
    const formattedDob = computed({
      get() {
        if (!profile.value.dob) return ''
        // Convert ISO to dd/mm/yyyy
        const date = new Date(profile.value.dob)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      },
      set(value) {
        // Convert dd/mm/yyyy to ISO
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
