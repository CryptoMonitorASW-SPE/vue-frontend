<template>
  <div class="crypto-table">
    <table>
      <thead>
        <tr>
          <th scope="col">Logo</th>
          <th
            scope="col"
            @click="sortTable('name')"
            @keydown.enter="sortTable('name')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Name
            <span v-if="sortKey === 'name'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('symbol')"
            @keydown.enter="sortTable('symbol')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'symbol' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Symbol
            <span v-if="sortKey === 'symbol'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('prices')"
            @keydown.enter="sortTable('prices')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'prices' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Price (USD)
            <span v-if="sortKey === 'prices'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('marketCap')"
            @keydown.enter="sortTable('marketCap')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'marketCap' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Market Cap (USD)
            <span v-if="sortKey === 'marketCap'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('totalVolume')"
            @keydown.enter="sortTable('totalVolume')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'totalVolume' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Volume (24h)
            <span v-if="sortKey === 'totalVolume'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('high24h')"
            @keydown.enter="sortTable('high24h')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'high24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            High (24h)
            <span v-if="sortKey === 'high24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('low24h')"
            @keydown.enter="sortTable('low24h')"
            style="cursor: pointer"
            :aria-sort="sortKey === 'low24h' ? (sortAsc ? 'ascending' : 'descending') : 'none'"
            tabindex="0"
          >
            Low (24h)
            <span v-if="sortKey === 'low24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('priceChangePercentage24h')"
            @keydown.enter="sortTable('priceChangePercentage24h')"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'priceChangePercentage24h'
                ? sortAsc
                  ? 'ascending'
                  : 'descending'
                : 'none'
            "
            tabindex="0"
          >
            Change (24h)
            <span v-if="sortKey === 'priceChangePercentage24h'">{{ sortAsc ? '↑' : '↓' }}</span>
          </th>
          <th
            scope="col"
            @click="sortTable('circulatingSupply')"
            @keydown.enter="sortTable('circulatingSupply')"
            style="cursor: pointer"
            :aria-sort="
              sortKey === 'circulatingSupply' ? (sortAsc ? 'ascending' : 'descending') : 'none'
            "
            tabindex="0"
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
          <td>{{ crypto.name }}</td>
          <td>{{ crypto.symbol.toUpperCase() }}</td>
          <td>{{ formatCurrency(crypto.prices.values.usd) }}</td>
          <td>{{ formatCurrency(crypto.marketCap.values.usd) }}</td>
          <td>{{ formatCurrency(crypto.totalVolume.values.usd) }}</td>
          <td>{{ formatCurrency(crypto.high24h.values.usd) }}</td>
          <td>{{ formatCurrency(crypto.low24h.values.usd) }}</td>
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

export default {
  name: 'CryptoTable',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cryptoStore = useCryptoStore()
    const cryptocurrencies = computed(() => cryptoStore.cryptocurrencies)
    const { filteredData } = useFilter(
      cryptocurrencies,
      computed(() => props.filters)
    )
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(filteredData)
    const finalCryptocurrencies = sortedData
    const { formatCurrency, formatPercentage, formatNumber, formatDate } = useFormat()
    watch(() => props.filters, { deep: true, immediate: true })

    return {
      finalCryptocurrencies,
      sortTable,
      formatCurrency,
      formatPercentage,
      formatNumber,
      formatDate,
      sortKey,
      sortAsc
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
