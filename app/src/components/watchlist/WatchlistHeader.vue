<template>
  <div class="table-header">
    <h1>Watched Cryptocurrencies</h1>
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
