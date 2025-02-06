<template>
  <div class="table-header">
    <h1>Watched Cryptocurrencies</h1>
    <div class="table-actions">
      <button v-if="!listEmpty" class="btn btn-primary" @click="$emit('add-notification')">
        Add Notification
      </button>
      <button v-if="!listEmpty" class="btn btn-primary" @click="$emit('list-notification')">
        List Notification
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WatchlistHeader',
  props: {
    listEmpty: {
      type: Boolean,
      required: true
    }
  },
  emits: ['add-notification', 'list-notification']
}
</script>
<style scoped lang="scss">
.table-actions {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
