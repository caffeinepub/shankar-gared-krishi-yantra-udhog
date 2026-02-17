import { ExternalBlob } from '@/backend';
import type { ProductInput } from '@/backend';

/**
 * Standard Open End Wrench sizes commonly available in hardware stores
 */
export const OPEN_END_WRENCH_SIZES = [
  '6x7 mm',
  '8x9 mm',
  '10x11 mm',
  '12x13 mm',
  '14x15 mm',
  '16x17 mm',
  '18x19 mm',
  '20x22 mm',
  '24x27 mm',
  '30x32 mm',
];

/**
 * Creates ProductInput objects for all Open End Wrench sizes
 * Uses the shared product image asset
 */
export function createOpenEndWrenchProducts(): ProductInput[] {
  const sharedImageUrl = '/assets/generated/open-end-wrench.dim_1200x800.png';
  const basePrice = BigInt(150); // Base price in rupees

  return OPEN_END_WRENCH_SIZES.map((size) => ({
    name: `Open End Wrench ${size}`,
    description: `Professional quality open end wrench size ${size}. Double-ended design for versatile use. Chrome-vanadium steel construction for durability and strength.`,
    price: basePrice,
    photo: ExternalBlob.fromURL(sharedImageUrl),
    gallery: [],
  }));
}
