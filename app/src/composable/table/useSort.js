import { ref, computed } from 'vue'

export function useSort(data) {
  const sortKey = ref('name')
  const sortAsc = ref(true)

  const sortTable = key => {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

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
