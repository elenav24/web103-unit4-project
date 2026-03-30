
export function calcPrice(selections, optionsData) {
  if (!optionsData) return 0
  return Object.entries(selections).reduce((sum, [cat, key]) => {
    const opt = optionsData[cat]?.find(o => o.key === key)
    return sum + (opt?.price ?? 0)
  }, 0)
}
