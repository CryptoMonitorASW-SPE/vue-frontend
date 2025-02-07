self.addEventListener('message', e => {
  const { transactions } = e.data

  if (!transactions || !transactions.length) {
    self.postMessage({ investedValue: 0, performanceHistory: [] })
    return
  }

  const investedValue = transactions.reduce((acc, t) => {
    const quantity = parseFloat(t.quantity) || 0
    const price = parseFloat(t.priceAtPurchase) || 0
    const amount = quantity * price
    return t.type && t.type.toUpperCase() === 'BUY' ? acc + amount : acc - amount
  }, 0)

  let runningTotal = 0
  const performanceHistory = transactions
    .slice()
    .sort((a, b) => new Date(a.doneAt) - new Date(b.doneAt))
    .map(t => {
      const quantity = parseFloat(t.quantity) || 0
      const price = parseFloat(t.priceAtPurchase) || 0
      const amount = quantity * price
      runningTotal += t.type && t.type.toUpperCase() === 'BUY' ? amount : -amount
      return { date: t.doneAt, value: runningTotal, type: 'transaction' }
    })

  self.postMessage({ investedValue, performanceHistory })
})
