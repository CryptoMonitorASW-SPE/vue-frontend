<template>
  <div class="crypto-table">
    <table>
      <thead>
        <tr>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'added' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('added')"
            @keydown.enter="sortTable('added')"
          >
            ADDED
            <span v-if="sortKey === 'added'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th scope="col">Logo</th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('name')"
            @keydown.enter="sortTable('name')"
          >
            Name
            <span v-if="sortKey === 'name'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'symbol' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('symbol')"
            @keydown.enter="sortTable('symbol')"
          >
            Symbol
            <span v-if="sortKey === 'symbol'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'price' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('price')"
            @keydown.enter="sortTable('price')"
          >
            Price
            <span v-if="sortKey === 'price'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'priceChangePercentage' ? (sortAsc ? 'ascending' : 'descending') : 'none'
            "
            tabindex="0"
            @click="sortTable('priceChangePercentage')"
            @keydown.enter="sortTable('priceChangePercentage')"
          >
            Change
            <span v-if="sortKey === 'priceChangePercentage'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'lastUpdated' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('lastUpdated')"
            @keydown.enter="sortTable('lastUpdated')"
          >
            UpdatedDate
            <span v-if="sortKey === 'lastUpdated'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <WatchlistTableRow
          v-for="crypto in sortedCryptocurrencies"
          :key="crypto.id"
          :crypto="crypto"
          @delete="$emit('delete', crypto.itemId)"
        />
      </tbody>
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

    return {
      sortTable,
      sortedCryptocurrencies: sortedData,
      sortKey,
      sortAsc
    }
  }
}
</script>
