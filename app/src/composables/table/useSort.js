// composables/useSort.js
import { ref, computed } from 'vue'

export function useSort(data) {
  const sortKey = ref('name') // Chiave per ordinare
  const sortAsc = ref(true) // Ordinamento crescente o decrescente

  // Funzione di ordinamento
  const sortTable = key => {
    if (sortKey.value === key) {
      // Inverti l'ordine
      sortAsc.value = !sortAsc.value
    } else {
      // Nuovo ordinamento
      sortKey.value = key
      sortAsc.value = true
    }
  }

  // Funzione per estrarre il valore corretto per ogni tipo di dato
  const getValueForSorting = (crypto, key) => {
    if (
      key === 'prices' ||
      key === 'marketCap' ||
      key === 'totalVolume' ||
      key === 'high24h' ||
      key === 'low24h' ||
      key === 'priceChangePercentage24h'
    ) {
      return crypto[key]?.values?.usd || 0
    } else if (key === 'circulatingSupply') {
      return crypto[key] || 0
    } else {
      return crypto[key] || ''
    }
  }

  // Ordinamento dei dati
  const sortedData = computed(() => {
    const sorted = [...data.value]
    sorted.sort((a, b) => {
      const aValue = getValueForSorting(a, sortKey.value)
      const bValue = getValueForSorting(b, sortKey.value)

      if (aValue > bValue) {
        return sortAsc.value ? 1 : -1
      } else if (aValue < bValue) {
        return sortAsc.value ? -1 : 1
      } else {
        return 0
      }
    })
    return sorted
  })

  return {
    sortTable,
    sortedData,
    sortKey,
    sortAsc
  }
}
