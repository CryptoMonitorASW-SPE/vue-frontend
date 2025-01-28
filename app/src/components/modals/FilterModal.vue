<template>
  <div v-if="isVisible" class="filter-modal" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <h4>Filters</h4>

      <label for="minPrice">Min Price</label>
      <input
        v-model.number="localFilters.minPrice"
        type="number"
        id="minPrice"
        placeholder="Min price"
      />

      <label for="maxPrice">Max Price</label>
      <input
        v-model.number="localFilters.maxPrice"
        type="number"
        id="maxPrice"
        placeholder="Max price"
      />

      <label for="change24h">Change (24h)</label>
      <input
        v-model.number="localFilters.change24h"
        type="number"
        id="change24h"
        placeholder="Min change (24h)"
      />

      <div class="modal-buttons">
        <button @click="applyFilters">Apply Filters</button>
        <button @click="resetFilters">Reset Filters</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localFilters: { ...this.filters }
    }
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', this.localFilters) // Emissione dei filtri applicati al componente padre
    },
    resetFilters() {
      this.localFilters = {
        minPrice: null,
        maxPrice: null,
        change24h: null
      }
    },
    closeModal() {
      this.$emit('close') // Chiusura della finestra modale
    }
  }
}
</script>

<style scoped>
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assicurati che il modal sia sopra altri elementi */
}

.modal-content {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content h4 {
  margin-bottom: 20px;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  box-sizing: border-box;
}

.modal-content input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}

.modal-content button {
  padding: 8px 12px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-left: 10px;
  font-size: var(--font-size-base);
  box-shadow: var(--box-shadow);
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.modal-content button:first-of-type {
  background-color: var(--primary-color);
  color: white;
}

.modal-content button:first-of-type:hover {
  background-color: #2e4a99;
  transform: scale(1.05);
}

.modal-content button:last-of-type {
  background-color: #ccc;
  color: #333;
}

.modal-content button:last-of-type:hover {
  background-color: #999;
  transform: scale(1.05);
}

.modal-content button.reset-btn {
  background-color: #f0f0f0;
  color: #333;
}

.modal-content button.reset-btn:hover {
  background-color: #d9d9d9;
}
</style>
