/**
 * calcPrice(selections, optionsData) → number
 * selections: { top, bottom, shoes, accessory }
 * optionsData: the OUTFIT_OPTIONS constant
 * Returns sum of prices for each selected option key
 */
export function calcPrice(selections, optionsData) {
  let total = 0;
  for (const category in selections) {
    const key = selections[category];
    const options = optionsData[category] ?? [];
    const match = options.find((opt) => opt.key === key);
    if (match) total += match.price;
  }
  return total;
}
