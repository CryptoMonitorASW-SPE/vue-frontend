import { computed } from 'vue'

export function useFilter(data, filters) {
  const filteredData = computed(() => {
    const {
      minPrice,
      maxPrice,
      minChange24h,
      maxChange24h,
      minVolume,
      maxVolume,
      minMarketCap,
      maxMarketCap
    } = filters.value

    const validFilters = {
      minPrice: Number.isFinite(minPrice) ? minPrice : null,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : null,
      minChange24h: Number.isFinite(minChange24h) ? minChange24h : null,
      maxChange24h: Number.isFinite(maxChange24h) ? maxChange24h : null,
      minVolume: Number.isFinite(minVolume) ? minVolume : null,
      maxVolume: Number.isFinite(maxVolume) ? maxVolume : null,
      minMarketCap: Number.isFinite(minMarketCap) ? minMarketCap : null,
      maxMarketCap: Number.isFinite(maxMarketCap) ? maxMarketCap : null
    }

    return data.value.filter(crypto => {
      const price = crypto.price
      const change24h = crypto.priceChangePercentage24h
      const volume = crypto.totalVolume
      const marketCap = crypto.marketCap

      // Filtro per il Price
      if (validFilters.minPrice !== null && price < validFilters.minPrice) return false
      if (validFilters.maxPrice !== null && price > validFilters.maxPrice) return false

      // Filtro per il Change (24h)
      if (validFilters.minChange24h !== null && change24h < validFilters.minChange24h) return false
      if (validFilters.maxChange24h !== null && change24h > validFilters.maxChange24h) return false

      // Filtro per il Volume
      if (validFilters.minVolume !== null && volume < validFilters.minVolume) return false
      if (validFilters.maxVolume !== null && volume > validFilters.maxVolume) return false

      // Filtro per il Market Cap
      if (validFilters.minMarketCap !== null && marketCap < validFilters.minMarketCap) return false
      if (validFilters.maxMarketCap !== null && marketCap > validFilters.maxMarketCap) return false

      return true
    })
  })

  return {
    filteredData
  }
}
