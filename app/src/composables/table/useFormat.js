export function useFormat() {
  const formatCurrency = value => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = value => {
    return value.toFixed(2) + '%'
  }

  const formatNumber = value => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return {
    formatCurrency,
    formatPercentage,
    formatNumber,
    formatDate
  }
}
