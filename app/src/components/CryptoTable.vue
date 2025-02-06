<template>
  <div class="crypto-table">
    <table>
      <thead>
        <tr>
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
            :aria-sort="sortKey === 'prices' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('prices')"
            @keydown.enter="sortTable('prices')"
          >
            Price
            <span v-if="sortKey === 'prices'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'marketCap' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('marketCap')"
            @keydown.enter="sortTable('marketCap')"
          >
            Market Cap
            <span v-if="sortKey === 'marketCap'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'totalVolume' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('totalVolume')"
            @keydown.enter="sortTable('totalVolume')"
          >
            Volume (24h)
            <span v-if="sortKey === 'totalVolume'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'high24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('high24h')"
            @keydown.enter="sortTable('high24h')"
          >
            High (24h)
            <span v-if="sortKey === 'high24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="sortKey === 'low24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
            @click="sortTable('low24h')"
            @keydown.enter="sortTable('low24h')"
          >
            Low (24h)
            <span v-if="sortKey === 'low24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
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
          >
            Change (24h)
            <span v-if="sortKey === 'priceChangePercentage24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'circulatingSupply' ? (sortAsc ? 'ascending' : 'descending') : 'none'
            "
            tabindex="0"
            @click="sortTable('circulatingSupply')"
            @keydown.enter="sortTable('circulatingSupply')"
          >
            Circulating Supply
            <span v-if="sortKey === 'circulatingSupply'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th scope="col">Last Update</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="crypto in finalCryptocurrencies"
          :key="crypto.id"
          :class="{ 'updated-row': crypto.updated }"
        >
          <td>
            <img
              :src="crypto.image"
              :alt="'Logo della criptovaluta ' + crypto.name"
              class="crypto-logo"
            />
          </td>
          <td>
            <RouterLink
              :to="`/crypto/${crypto.id}`"
              class="crypto-link"
              :aria-label="`View details for ${crypto.name}`"
            >
              {{ crypto.name }}
            </RouterLink>
          </td>
          <td>{{ crypto.symbol.toUpperCase() }}</td>
          <td>{{ formatCurrency(crypto.price, selectedCurrency) }}</td>
          <td>{{ formatCurrency(crypto.marketCap, selectedCurrency) }}</td>
          <td>{{ formatCurrency(crypto.totalVolume, selectedCurrency) }}</td>
          <td>{{ formatCurrency(crypto.high24h, selectedCurrency) }}</td>
          <td>{{ formatCurrency(crypto.low24h, selectedCurrency) }}</td>
          <td
            :class="{
              positive: crypto.priceChangePercentage24h >= 0,
              negative: crypto.priceChangePercentage24h < 0
            }"
          >
            {{ formatPercentage(crypto.priceChangePercentage24h) }}
          </td>
          <td>{{ formatNumber(crypto.circulatingSupply) }}</td>
          <td>{{ formatDate(crypto.lastUpdated) }}</td>
        </tr>
      </tbody>
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

.crypto-link {
  color: inherit;
  text-decoration: none;
  display: block;
  padding: 0.5rem;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}
</style>
