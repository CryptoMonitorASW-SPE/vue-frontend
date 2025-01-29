<template>
  <div
    v-if="isVisible"
    class="modal-overlay d-flex align-items-center justify-content-center"
    role="button"
    aria-label="Chiudi la finestra modale cliccando sullo sfondo"
    tabindex="0"
    @click="closeModal"
    @keydown.enter="closeModal"
  >
    <div class="filter-modal modal-content p-4" role="dialog" aria-modal="true" @click.stop>
      <button class="close-btn btn-close" aria-label="Chiudi" @click.stop="closeModal"></button>
      <h4 class="modal-title mb-4">Filters</h4>

      <div class="mb-3">
        <label for="minPrice" class="form-label">Min Price</label>
        <input
          id="minPrice"
          v-model.number="localFilters.minPrice"
          type="number"
          class="form-control"
          placeholder="Min price"
        />
      </div>

      <div class="mb-3">
        <label for="maxPrice" class="form-label">Max Price</label>
        <input
          id="maxPrice"
          v-model.number="localFilters.maxPrice"
          type="number"
          class="form-control"
          placeholder="Max price"
        />
      </div>

      <div class="mb-4">
        <label for="change24h" class="form-label">Change (24h)</label>
        <input
          id="change24h"
          v-model.number="localFilters.change24h"
          type="number"
          class="form-control"
          placeholder="Min change (24h)"
        />
      </div>

      <div class="modal-buttons d-flex justify-content-end gap-2">
        <button class="apply-btn btn btn-primary" @click.stop="applyFilters">Apply Filters</button>
        <button class="reset-btn btn btn-secondary" @click.stop="resetFilters">
          Reset Filters
        </button>
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
      this.$emit('apply-filters', this.localFilters)
    },
    resetFilters() {
      this.localFilters = {
        minPrice: null,
        maxPrice: null,
        change24h: null
      }
    },
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/filtermodal';
</style>
