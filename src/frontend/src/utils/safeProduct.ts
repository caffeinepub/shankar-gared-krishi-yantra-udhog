/**
 * Runtime-safe helpers to validate and normalize product fields and extract image URLs
 * from potentially missing or invalid ExternalBlob instances without throwing errors.
 */

import type { Product } from '@/backend';

/**
 * Safely extract a direct URL from an ExternalBlob-like object.
 * Returns null if the blob is invalid or getDirectURL throws.
 */
export function safeGetDirectURL(blob: any): string | null {
  if (!blob) return null;
  
  try {
    if (typeof blob.getDirectURL === 'function') {
      const url = blob.getDirectURL();
      return typeof url === 'string' && url.length > 0 ? url : null;
    }
  } catch (error) {
    console.warn('Failed to get direct URL from blob:', error);
  }
  
  return null;
}

/**
 * Safely get the primary photo URL from a product.
 * Returns null if the photo is missing or invalid.
 */
export function safeGetProductPhotoURL(product: Product | null | undefined): string | null {
  if (!product || !product.photo) return null;
  return safeGetDirectURL(product.photo);
}

/**
 * Safely get all gallery image URLs from a product.
 * Filters out any invalid blobs and returns only valid URLs.
 */
export function safeGetProductGalleryURLs(product: Product | null | undefined): string[] {
  if (!product || !product.gallery || !Array.isArray(product.gallery)) {
    return [];
  }
  
  return product.gallery
    .map(blob => safeGetDirectURL(blob))
    .filter((url): url is string => url !== null);
}

/**
 * Safely get all image URLs from a product (primary + gallery).
 * Returns an array with at least the primary photo if valid, or an empty array.
 */
export function safeGetAllProductImageURLs(product: Product | null | undefined): string[] {
  const urls: string[] = [];
  
  const primaryURL = safeGetProductPhotoURL(product);
  if (primaryURL) {
    urls.push(primaryURL);
  }
  
  const galleryURLs = safeGetProductGalleryURLs(product);
  urls.push(...galleryURLs);
  
  return urls;
}

/**
 * Get a safe product name with fallback.
 */
export function safeGetProductName(product: Product | null | undefined): string {
  if (!product || typeof product.name !== 'string' || product.name.trim().length === 0) {
    return 'Unnamed Product';
  }
  return product.name;
}

/**
 * Get a safe product description with fallback.
 */
export function safeGetProductDescription(product: Product | null | undefined): string {
  if (!product || typeof product.description !== 'string' || product.description.trim().length === 0) {
    return 'No description available';
  }
  return product.description;
}

/**
 * Get a safe product price with fallback.
 */
export function safeGetProductPrice(product: Product | null | undefined): bigint {
  if (!product || typeof product.price !== 'bigint') {
    return BigInt(0);
  }
  return product.price;
}
