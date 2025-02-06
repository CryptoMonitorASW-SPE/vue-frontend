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

      <!-- Price Filters Fieldset -->
      <fieldset class="mb-3">
        <legend class="form-label">Price</legend>
        <div class="d-flex">
          <div class="flex-grow-1 me-2">
            <label for="minPrice" class="visually-hidden">Min Price</label>
            <input
              id="minPrice"
              v-model.number="localFilters.minPrice"
              type="number"
              class="form-control"
              placeholder="Min price"
            />
          </div>
          <div class="flex-grow-1">
            <label for="maxPrice" class="visually-hidden">Max Price</label>
            <input
              id="maxPrice"
              v-model.number="localFilters.maxPrice"
              type="number"
              class="form-control"
              placeholder="Max price"
            />
          </div>
        </div>
      </fieldset>

      <!-- Change (24h) Filters Fieldset -->
      <fieldset class="mb-3">
        <legend class="form-label">Change (24h) %</legend>
        <div class="d-flex">
          <div class="flex-grow-1 me-2">
            <label for="minChange24h" class="visually-hidden">Min Change (24h)</label>
            <input
              id="minChange24h"
              v-model.number="localFilters.minChange24h"
              type="number"
              class="form-control"
              placeholder="Min change"
            />
          </div>
          <div class="flex-grow-1">
            <label for="maxChange24h" class="visually-hidden">Max Change (24h)</label>
            <input
              id="maxChange24h"
              v-model.number="localFilters.maxChange24h"
              type="number"
              class="form-control"
              placeholder="Max change"
            />
          </div>
        </div>
      </fieldset>

      <!-- Volume Filters Fieldset -->
      <fieldset class="mb-3">
        <legend class="form-label">Volume</legend>
        <div class="d-flex">
          <div class="flex-grow-1 me-2">
            <label for="minVolume" class="visually-hidden">Min Volume</label>
            <input
              id="minVolume"
              v-model.number="localFilters.minVolume"
              type="number"
              class="form-control"
              placeholder="Min volume"
            />
          </div>
          <div class="flex-grow-1">
            <label for="maxVolume" class="visually-hidden">Max Volume</label>
            <input
              id="maxVolume"
              v-model.number="localFilters.maxVolume"
              type="number"
              class="form-control"
              placeholder="Max volume"
            />
          </div>
        </div>
      </fieldset>

      <!-- Market Cap Filters Fieldset -->
      <fieldset class="mb-4">
        <legend class="form-label">Market Cap</legend>
        <div class="d-flex">
          <div class="flex-grow-1 me-2">
            <label for="minMarketCap" class="visually-hidden">Min Market Cap</label>
            <input
              id="minMarketCap"
              v-model.number="localFilters.minMarketCap"
              type="number"
              class="form-control"
              placeholder="Min market cap"
            />
          </div>
          <div class="flex-grow-1">
            <label for="maxMarketCap" class="visually-hidden">Max Market Cap</label>
            <input
              id="maxMarketCap"
              v-model.number="localFilters.maxMarketCap"
              type="number"
              class="form-control"
              placeholder="Max market cap"
            />
          </div>
        </div>
      </fieldset>

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
      // Inizializza i filtri locali con i nuovi campi
      localFilters: {
        minPrice: null,
        maxPrice: null,
        minChange24h: null,
        maxChange24h: null,
        minVolume: null,
        maxVolume: null,
        minMarketCap: null,
        maxMarketCap: null
      }
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
        minChange24h: null,
        maxChange24h: null,
        minVolume: null,
        maxVolume: null,
        minMarketCap: null,
        maxMarketCap: null
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
