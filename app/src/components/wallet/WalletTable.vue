<template>
  <div class="table-container" tabindex="0" role="region" aria-label="Transactions Table">
    <table class="transaction-table" role="grid" aria-label="Transactions Table">
      <caption class="sr-only">
        Transactions table showing wallet transaction details.
      </caption>
      <thead>
        <tr data-row="0">
          <th data-col="0" tabindex="0" @keydown="handleGridNavigation">#</th>
          <th data-col="1" tabindex="0" @keydown="handleGridNavigation">Crypto ID</th>
          <th data-col="2" tabindex="0" @keydown="handleGridNavigation">Quantity</th>
          <th data-col="3" tabindex="0" @keydown="handleGridNavigation">Type</th>
          <th data-col="4" tabindex="0" @keydown="handleGridNavigation">Date</th>
          <th data-col="5" tabindex="0" @keydown="handleGridNavigation">Price</th>
          <th data-col="6" tabindex="0" @keydown="handleGridNavigation">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(transaction, rowIndex) in transactions"
          :key="transaction.id"
          :data-row="rowIndex + 1"
        >
          <th role="rowheader" data-col="0" tabindex="0" @keydown="handleGridNavigation">
            {{ rowIndex + 1 }}
          </th>
          <td role="gridcell" data-col="1" tabindex="0" @keydown="handleGridNavigation">
            {{ transaction.cryptoId }}
          </td>
          <td role="gridcell" data-col="2" tabindex="0" @keydown="handleGridNavigation">
            {{ transaction.quantity }}
          </td>
          <td role="gridcell" data-col="3" tabindex="0" @keydown="handleGridNavigation">
            <span
              class="badge"
              :class="{
                'bg-success': transaction.type === 'BUY',
                'bg-danger': transaction.type === 'SELL'
              }"
            >
              {{ transaction.type }}
            </span>
          </td>
          <td role="gridcell" data-col="4" tabindex="0" @keydown="handleGridNavigation">
            {{ formatDate(transaction.doneAt) }}
          </td>
          <td role="gridcell" data-col="5" tabindex="0" @keydown="handleGridNavigation">
            ${{
              transaction.priceAtPurchase != null ? transaction.priceAtPurchase.toFixed(2) : '0.00'
            }}
          </td>
          <td role="gridcell" data-col="6" tabindex="0" @keydown="handleGridNavigation">
            <button
              class="btn btn-sm btn-danger"
              aria-label="Delete transaction"
              @click="deleteTransaction(transaction.id)"
            >
              <i class="bi bi-trash3-fill" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="7" class="text-center">No transactions found.</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td id="table-summary" colspan="7" role="contentinfo">
            Wallet transactions details.
            <span class="sr-only">End of wallet transactions table</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WalletTable',
  props: {
    transactions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['delete-transaction'],
  setup(props, { emit }) {
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

    const formatDate = dateStr => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toISOString().split('T')[0]
    }

    const deleteTransaction = id => {
      emit('delete-transaction', id)
    }

    return {
      handleGridNavigation,
      formatDate,
      deleteTransaction
    }
  }
})
</script>
