<template>
  <div v-if="cryptocurrencies.length === 0" class="text-center my-5">
    <div>
      <h2>Your watchlist is empty</h2>
      <p class="lead">Start tracking cryptocurrencies by adding them to your watchlist</p>
    </div>
  </div>

  <div v-else class="table-container">
    <table class="watchlist-table" role="grid" aria-label="Cryptocurrency Watchlist Table">
      <!-- A caption that is visually hidden but announced by screen readers -->
      <caption class="visually-hidden">
        Cryptocurrency Watchlist Table
      </caption>
      <thead>
        <tr data-row="0">
          <th data-col="0" tabindex="0" @keydown="handleGridNavigation">#</th>
          <th
            scope="col"
            data-col="1"
            style="cursor: pointer"
            :aria-sort="sortKey === 'added' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('added')"
            @keydown.enter="sortTable('added')"
            @keydown="handleGridNavigation"
          >
            Added
            <span v-if="sortKey === 'added'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th scope="col" data-col="2" tabindex="0" @keydown="handleGridNavigation">Logo</th>
          <th
            scope="col"
            data-col="3"
            style="cursor: pointer"
            :aria-sort="sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('name')"
            @keydown.enter="sortTable('name')"
            @keydown="handleGridNavigation"
          >
            Name
            <span v-if="sortKey === 'name'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            data-col="4"
            style="cursor: pointer"
            :aria-sort="sortKey === 'symbol' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('symbol')"
            @keydown.enter="sortTable('symbol')"
            @keydown="handleGridNavigation"
          >
            Symbol
            <span v-if="sortKey === 'symbol'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th scope="col" data-col="5" tabindex="0" @keydown="handleGridNavigation">Price</th>
          <th scope="col" data-col="6" tabindex="0" @keydown="handleGridNavigation">Change</th>
          <th scope="col" data-col="7" tabindex="0" @keydown="handleGridNavigation">
            Updated Date
          </th>
          <th scope="col" data-col="8" tabindex="0" @keydown="handleGridNavigation">Actions</th>
        </tr>
      </thead>
      <tbody>
        <WatchlistTableRow
          v-for="(crypto, index) in sortedCryptocurrencies"
          :key="crypto.id"
          :crypto="crypto"
          :data-row="index + 1"
          @keydown="handleGridNavigation"
          @delete="$emit('delete', crypto.itemId)"
        />
      </tbody>
      <tfoot>
        <tr>
          <td id="table-summary" colspan="7" role="contentinfo">
            Watchlist table displays monitored cryptocurrencies with latest prices and changes.
            Click on column headers to sort data.
            <span class="sr-only">End of watchlist table</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useSort } from '@/composables/table/useSort'
import WatchlistTableRow from './WatchlistTableRow.vue'

export default {
  name: 'WatchlistTable',
  components: {
    WatchlistTableRow
  },
  props: {
    cryptocurrencies: {
      type: Array,
      required: true
    }
  },
  emits: ['delete'],
  setup(props) {
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(
      computed(() => props.cryptocurrencies)
    )

    const handleGridNavigation = event => {
      const currentElement = event.currentTarget
      const tr = currentElement.closest('tr')
      if (!tr) return
      const row = Number(tr.getAttribute('data-row'))
      const col = Number(currentElement.getAttribute('data-col'))
      if (isNaN(row) || isNaN(col)) return

      let newRow = row
      let newCol = col

      switch (event.key) {
        case 'ArrowRight':
          newCol = col + 1
          break
        case 'ArrowLeft':
          newCol = col - 1
          break
        case 'ArrowDown':
          newRow = row + 1
          break
        case 'ArrowUp':
          newRow = row - 1
          break
        default:
          return
      }
      event.preventDefault()
      const table = currentElement.closest('table')
      if (!table) return

      const targetCell = table.querySelector(
        `[data-row="${newRow}"] [data-col="${newCol}"], [data-row="${newRow}"][data-col="${newCol}"]`
      )
      if (targetCell) {
        targetCell.focus()
      }
    }

    return {
      sortTable,
      sortedCryptocurrencies: sortedData,
      sortKey,
      sortAsc,
      handleGridNavigation
    }
  }
}
</script>
