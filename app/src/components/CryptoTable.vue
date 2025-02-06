<template>
  <div
    class="table-container"
    role="region"
    aria-label="Cryptocurrencies Table container"
    tabindex="0"
  >
    <table class="crypto-table" role="grid" aria-label="Cryptocurrencies Table">
      <caption class="sr-only">
        Crypto Table showing name, symbol, price, and market cap.
      </caption>
      <thead>
        <tr data-row="0">
          <th data-col="0" tabindex="0" @keydown="handleGridNavigation">#</th>
          <th data-col="1" tabindex="0" @keydown="handleGridNavigation">Logo</th>
          <th
            data-col="2"
            tabindex="0"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            @click="sortTable('name')"
            @keydown.enter="sortTable('name')"
            @keydown="handleGridNavigation"
          >
            Name
            <span v-if="sortKey === 'name'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="3"
            scope="col"
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
          <th
            data-col="4"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'prices' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('prices')"
            @keydown.enter="sortTable('prices')"
            @keydown="handleGridNavigation"
          >
            Price
            <span v-if="sortKey === 'prices'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="5"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'marketCap' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('marketCap')"
            @keydown.enter="sortTable('marketCap')"
            @keydown="handleGridNavigation"
          >
            Market Cap
            <span v-if="sortKey === 'marketCap'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="6"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'totalVolume' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('totalVolume')"
            @keydown.enter="sortTable('totalVolume')"
            @keydown="handleGridNavigation"
          >
            Volume (24h)
            <span v-if="sortKey === 'totalVolume'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="7"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'high24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('high24h')"
            @keydown.enter="sortTable('high24h')"
            @keydown="handleGridNavigation"
          >
            High (24h)
            <span v-if="sortKey === 'high24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="8"
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'low24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('low24h')"
            @keydown.enter="sortTable('low24h')"
            @keydown="handleGridNavigation"
          >
            Low (24h)
            <span v-if="sortKey === 'low24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="9"
            scope="col"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'priceChangePercentage24h'
                ? sortAsc
                  ? 'ascending'
                  : 'descending'
                : 'none'
            "
            tabindex="0"
            @click="sortTable('priceChangePercentage24h')"
            @keydown.enter="sortTable('priceChangePercentage24h')"
            @keydown="handleGridNavigation"
          >
            Change (24h)
            <span v-if="sortKey === 'priceChangePercentage24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            data-col="10"
            scope="col"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'circulatingSupply' ? (sortAsc ? 'ascending' : 'descending') : 'none'
            "
            tabindex="0"
            @click="sortTable('circulatingSupply')"
            @keydown.enter="sortTable('circulatingSupply')"
            @keydown="handleGridNavigation"
          >
            Circulating Supply
            <span v-if="sortKey === 'circulatingSupply'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th data-col="11" tabindex="0" scope="col" @keydown="handleGridNavigation">
            Last Update
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(crypto, index) in finalCryptocurrencies"
          :key="crypto.id"
          :data-row="index + 1"
          :class="{ 'updated-row': crypto.updated }"
        >
          <th role="rowheader" data-col="0" tabindex="0" @keydown="handleGridNavigation">
            {{ index + 1 }}
          </th>
          <td role="gridcell" data-col="1" tabindex="0" @keydown="handleGridNavigation">
            <RouterLink
              :to="`/crypto/${crypto.id}`"
              class="crypto-link"
              :aria-label="`View details for ${crypto.name}`"
            >
              <img
                :src="crypto.image"
                :alt="'Logo della criptovaluta ' + crypto.name"
                class="crypto-logo"
              />
            </RouterLink>
          </td>
          <td role="gridcell" data-col="2" tabindex="0" @keydown="handleGridNavigation">
            <RouterLink
              :to="`/crypto/${crypto.id}`"
              class="crypto-link"
              :aria-label="`View details for ${crypto.name}`"
            >
              {{ crypto.name }}
            </RouterLink>
          </td>
          <td role="gridcell" data-col="3" tabindex="0" @keydown="handleGridNavigation">
            {{ crypto.symbol.toUpperCase() }}
          </td>
          <td role="gridcell" data-col="4" tabindex="0" @keydown="handleGridNavigation">
            {{ formatCurrency(crypto.price, selectedCurrency) }}
          </td>
          <td role="gridcell" data-col="5" tabindex="0" @keydown="handleGridNavigation">
            {{ formatCurrency(crypto.marketCap, selectedCurrency) }}
          </td>
          <td role="gridcell" data-col="6" tabindex="0" @keydown="handleGridNavigation">
            {{ formatCurrency(crypto.totalVolume, selectedCurrency) }}
          </td>
          <td role="gridcell" data-col="7" tabindex="0" @keydown="handleGridNavigation">
            {{ formatCurrency(crypto.high24h, selectedCurrency) }}
          </td>
          <td role="gridcell" data-col="8" tabindex="0" @keydown="handleGridNavigation">
            {{ formatCurrency(crypto.low24h, selectedCurrency) }}
          </td>
          <td
            role="gridcell"
            data-col="9"
            tabindex="0"
            :class="{
              positive: crypto.priceChangePercentage24h >= 0,
              negative: crypto.priceChangePercentage24h < 0
            }"
            @keydown="handleGridNavigation"
          >
            {{ formatPercentage(crypto.priceChangePercentage24h) }}
          </td>
          <td role="gridcell" data-col="10" tabindex="0" @keydown="handleGridNavigation">
            {{ formatNumber(crypto.circulatingSupply) }}
          </td>
          <td role="gridcell" data-col="11" tabindex="0" @keydown="handleGridNavigation">
            {{ formatDate(crypto.lastUpdated) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td id="table-summary" colspan="5" role="contentinfo">
            Cryptocurrencies table summary.
            <span class="sr-only">End of cryptocurrencies table</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useCryptoStore } from '../stores/CryptoStore'
import { useSort } from '../composables/table/useSort'
import { useFilter } from '../composables/table/useFilter'
import { useFormat } from '../composables/table/useFormat'
import { useSearch } from '../composables/table/useSearch'

export default {
  name: 'CryptoTable',
  props: {
    filters: {
      type: Object,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const handleGridNavigation = event => {
      const currentCell = event.currentTarget
      const tr = currentCell.closest('tr')
      if (!tr) return
      const row = Number(tr.getAttribute('data-row'))
      const col = Number(currentCell.getAttribute('data-col'))
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

      const table = currentCell.closest('table')
      if (!table) return

      const targetCell = table.querySelector(
        `[data-row="${newRow}"] [data-col="${newCol}"], [data-row="${newRow}"][data-col="${newCol}"]`
      )
      if (targetCell) {
        targetCell.focus()
      }
    }

    const cryptoStore = useCryptoStore()
    const selectedCurrency = computed(() => cryptoStore.selectedCurrency)
    const cryptocurrencies = computed(() => cryptoStore.cryptocurrencies)

    // Filtri
    const { filteredData } = useFilter(
      cryptocurrencies,
      computed(() => props.filters)
    )

    // Sorting
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(filteredData)
    const searchQueryRef = computed(() => props.searchQuery)
    const { searchResults } = useSearch(sortedData, searchQueryRef)
    const finalCryptocurrencies = searchResults

    // Formattazione
    const { formatCurrency, formatPercentage, formatNumber, formatDate } = useFormat()

    // Watch per aggiornamento filtri
    watch(() => props.filters, { deep: true, immediate: true })

    return {
      handleGridNavigation,
      finalCryptocurrencies,
      sortTable,
      formatCurrency,
      formatPercentage,
      formatNumber,
      formatDate,
      sortKey,
      sortAsc,
      selectedCurrency
    }
  }
}
</script>

<style>
.crypto-logo {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
</style>
