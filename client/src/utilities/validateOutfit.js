import { INCOMPATIBLE_PAIRS } from './outfitOptions.js';

/**
 * validateOutfit(selections) → { valid: boolean, message: string }
 * Checks selections against INCOMPATIBLE_PAIRS list.
 * Returns { valid: true, message: '' } or { valid: false, message: reason }
 */
export function validateOutfit(selections) {
  const selectedKeys = Object.values(selections);

  for (const [keyA, keyB, reason] of INCOMPATIBLE_PAIRS) {
    if (selectedKeys.includes(keyA) && selectedKeys.includes(keyB)) {
      return { valid: false, message: reason };
    }
  }

  return { valid: true, message: '' };
}
