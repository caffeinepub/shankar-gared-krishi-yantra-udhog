/**
 * Reusable image renderer that safely handles potentially invalid blobs or URLs
 * and displays a visible placeholder when images cannot be loaded.
 */

import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SafeProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

export default function SafeProductImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
}: SafeProductImageProps) {
  const [hasError, setHasError] = useState(false);

  // Show placeholder if no src or error occurred
  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${placeholderClassName || className}`}
      >
        <div className="text-center p-4">
          <ImageOff className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
