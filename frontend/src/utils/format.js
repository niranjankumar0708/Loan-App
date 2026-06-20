// Currency and numeric formatting utility functions

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

export const formatPercent = (value) => {
  return `${value}%`
}
