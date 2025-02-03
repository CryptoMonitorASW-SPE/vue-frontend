<template>
  <div class="crypto-table-container">
    <!-- Header with actions -->
    <div class="table-header">
      <h2>Watched Cryptocurrencies</h2>
      <div class="table-actions">
        <button class="btn" @click="addNotification">ADD NOTIFICATION</button>
        <button class="btn" @click="listNotification">LIST NOTIFICATION</button>
      </div>
    </div>

    <div class="crypto-table">
      <table>
        <thead>
          <tr>
            <!-- ADDED column with sorting -->
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
            <!-- Logo column is not sortable -->
            <th scope="col">Logo</th>
            <!-- Name column -->
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
            <!-- Symbol column -->
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
            <!-- Price column -->
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
            <!-- Change column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="
                sortKey === 'priceChangePercentage'
                  ? sortAsc
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
              tabindex="0"
              @click="sortTable('priceChangePercentage')"
              @keydown.enter="sortTable('priceChangePercentage')"
            >
              Change
              <span v-if="sortKey === 'priceChangePercentage'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
            <!-- UpdatedDate column -->
            <th
              scope="col"
              style="cursor: pointer"
              :aria-sort="
                sortKey === 'lastUpdated' ? (sortAsc ? 'ascending' : 'descending') : 'none'
              "
              tabindex="0"
              @click="sortTable('lastUpdated')"
              @keydown.enter="sortTable('lastUpdated')"
            >
              UpdatedDate
              <span v-if="sortKey === 'lastUpdated'">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crypto in finalCryptocurrencies"
            :key="crypto.id"
            :class="{ 'updated-row': crypto.updated }"
          >
            <!-- ADDED date field -->
            <td>{{ formatDate(crypto.added) }}</td>
            <!-- Logo -->
            <td>
              <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
            </td>
            <!-- Name with a link to details -->
            <td>
              <RouterLink
                :to="`/crypto/${crypto.id}`"
                class="crypto-link"
                :aria-label="`View details for ${crypto.name}`"
              >
                {{ crypto.name }}
              </RouterLink>
            </td>
            <!-- Symbol -->
            <td>{{ crypto.symbol.toUpperCase() }}</td>
            <!-- Price -->
            <td>{{ formatCurrency(crypto.price, selectedCurrency) }}</td>
            <!-- Change -->
            <td
              :class="{
                positive: crypto.priceChangePercentage >= 0,
                negative: crypto.priceChangePercentage < 0
              }"
            >
              {{ formatPercentage(crypto.priceChangePercentage) }}
            </td>
            <!-- UpdatedDate -->
            <td>{{ formatDate(crypto.lastUpdated) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useCryptoStore } from '../stores/CryptoStore'
import { useSort } from '../composables/table/useSort'
import { useFormat } from '../composables/table/useFormat'

export default {
  name: 'ProfileWatchlist',
  props: {
    // If you plan to add filters later
    filters: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup() {
    // Fake data for cryptocurrencies to populate the table
    const cryptocurrencies = ref([
      {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'btc', // Added symbol
        price: 30000,
        priceChangePercentage: 2.5, // Rename change to priceChangePercentage if needed
        image: 'path/to/bitcoin-logo.png', // Added image
        added: '2023-09-30', // Added date for ADDED column
        lastUpdated: '2023-10-01'
      },
      {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'eth', // Added symbol
        price: 2000,
        priceChangePercentage: -1.0,
        image: 'path/to/ethereum-logo.png',
        added: '2023-10-01',
        lastUpdated: '2023-10-02'
      },
      {
        id: 'ada',
        name: 'Cardano',
        symbol: 'ada', // Added symbol
        price: 1.5,
        priceChangePercentage: 3.2,
        image: 'path/to/cardano-logo.png',
        added: '2023-10-02',
        lastUpdated: '2023-10-03'
      }
    ])

    // Sorting functionality (using a composable hook)
    const { sortTable, sortedData, sortKey, sortAsc } = useSort(cryptocurrencies)
    const finalCryptocurrencies = sortedData

    // Formatting functions (using a composable hook)
    const { formatCurrency, formatPercentage, formatDate } = useFormat()

    // Set a fixed fake currency for display (could be 'usd')
    const selectedCurrency = ref('usd')

    return {
      cryptocurrencies,
      finalCryptocurrencies,
      sortTable,
      sortKey,
      sortAsc,
      formatCurrency,
      formatPercentage,
      formatDate,
      selectedCurrency
    }
  }
}
</script>

<style scoped>
/* Container for header and table */
.crypto-table-container {
  padding: 1rem;
}

/* Header above the table with a flex layout */
.table-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

/* Action buttons styling */
.table-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  background-color: var(--primary-color, #007bff);
  color: #fff;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.btn:hover,
.btn:focus {
  background-color: var(--primary-color-dark, #0056b3);
  outline: none;
}

/* Responsive table */
.crypto-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

th {
  background-color: #f9f9f9;
}

.crypto-logo {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
}

.crypto-link {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  padding: 0.25rem 0;
}

.crypto-link:hover {
  text-decoration: underline;
}

/* Coloring for change percentage */
.positive {
  color: green;
}

.negative {
  color: red;
}

/* Highlight row if updated */
.updated-row {
  background-color: #e8f5e9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  th,
  td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-actions {
    margin-top: 0.5rem;
  }
}
</style>
