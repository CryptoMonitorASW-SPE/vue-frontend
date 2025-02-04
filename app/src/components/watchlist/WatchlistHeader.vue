<template>
  <div class="table-header">
    <h2>Watched Cryptocurrencies</h2>
    <div class="table-actions">
      <button class="btn btn-primary" @click="$emit('add-notification')">Add Notification</button>
      <button class="btn btn-primary" @click="$emit('list-notification')">List Notification</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WatchlistHeader',
  emits: ['add-notification', 'list-notification']
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-actions .btn {
  margin-left: 10px;
}
</style>
