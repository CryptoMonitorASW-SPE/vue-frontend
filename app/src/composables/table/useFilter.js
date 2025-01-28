import { computed } from 'vue'

export function useFilter(data, filters) {
  const filteredData = computed(() => {
    return data.value.filter(crypto => {
      const price = crypto.price
      const change24h = crypto.priceChangePercentage24h

      // Verifica Min Price
      if (filters.value.minPrice !== null && price < filters.value.minPrice) {
        return false
      }

      // Verifica Max Price
      if (filters.value.maxPrice !== null && price > filters.value.maxPrice) {
        return false
      }

      // Verifica Change (24h)
      if (filters.value.change24h !== null && change24h < filters.value.change24h) {
        return false
      }

      return true
    })
  })

  return {
    filteredData
  }
}
