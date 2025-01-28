<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    role="button"
    aria-label="Chiudi la finestra modale cliccando sullo sfondo"
    tabindex="0"
    @click="closeModal"
    @keydown.enter="closeModal"
  >
    <div class="filter-modal" role="dialog" aria-modal="true" @click.stop>
      <button class="close-btn" @click.stop="closeModal">×</button>
      <h4>Filters</h4>

      <label for="minPrice">Min Price</label>
      <input
        id="minPrice"
        v-model.number="localFilters.minPrice"
        type="number"
        placeholder="Min price"
      />

      <label for="maxPrice">Max Price</label>
      <input
        id="maxPrice"
        v-model.number="localFilters.maxPrice"
        type="number"
        placeholder="Max price"
      />

      <label for="change24h">Change (24h)</label>
      <input
        id="change24h"
        v-model.number="localFilters.change24h"
        type="number"
        placeholder="Min change (24h)"
      />

      <div class="modal-buttons">
        <button class="apply-btn" @click.stop="applyFilters">Apply Filters</button>
        <button class="reset-btn" @click.stop="resetFilters">Reset Filters</button>
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
