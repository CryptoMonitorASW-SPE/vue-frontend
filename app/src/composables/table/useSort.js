import { ref, computed } from 'vue'

export function useSort(data) {
  const sortKey = ref('name') // Chiave per ordinare
  const sortAsc = ref(true) // Ordinamento crescente o decrescente

  // Aggiornata la funzione di ordinamento
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

  // Mappatura per convertire il sortKey nel campo reale dell'oggetto crypto
  const getValueForSorting = (crypto, key) => {
    switch (key) {
      case 'prices':
        return typeof crypto.price === 'number' ? crypto.price : 0
      case 'marketCap':
        return typeof crypto.marketCap === 'number' ? crypto.marketCap : 0
      case 'totalVolume':
        return typeof crypto.totalVolume === 'number' ? crypto.totalVolume : 0
      case 'high24h':
        return typeof crypto.high24h === 'number' ? crypto.high24h : 0
      case 'low24h':
        return typeof crypto.low24h === 'number' ? crypto.low24h : 0
      case 'priceChangePercentage24h':
        return typeof crypto.priceChangePercentage24h === 'number'
          ? crypto.priceChangePercentage24h
          : 0
      case 'circulatingSupply':
        return typeof crypto.circulatingSupply === 'number' ? crypto.circulatingSupply : 0
      default:
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
