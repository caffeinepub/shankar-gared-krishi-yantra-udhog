/**
 * Centralized store address configuration
 */
export const STORE_ADDRESS = 'Dakbel, Bagru, Rajasthan 303007';

/**
 * Returns Google Maps search URL for the store address
 */
export function getGoogleMapsURL(): string {
  const query = encodeURIComponent(STORE_ADDRESS);
  return `https://maps.google.com/?q=${query}`;
}
