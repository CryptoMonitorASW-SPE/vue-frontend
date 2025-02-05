console.log('WalletWorker started') // Should appear once when the worker loads

self.addEventListener('message', e => {
  const { transactions } = e.data
  console.log('WalletWorker received transactions:', transactions)

  if (!transactions || !transactions.length) {
    console.warn('No transactions received.')
    self.postMessage({ investedValue: 0, performanceHistory: [] })
    return
  }

  const investedValue = transactions.reduce((acc, t) => {
    const quantity = parseFloat(t.quantity) || 0
    const price = parseFloat(t.priceAtPurchase) || 0
    const amount = quantity * price
    console.log(
      `Transaction ${t.id}: type=${t.type}, quantity=${quantity}, price=${price}, amount=${amount}`
    )
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

  console.log('WalletWorker computed investedValue:', investedValue)
  console.log('WalletWorker computed performanceHistory:', performanceHistory)

  self.postMessage({ investedValue, performanceHistory })
})
