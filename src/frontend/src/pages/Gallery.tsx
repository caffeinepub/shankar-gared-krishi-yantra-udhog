import { useState } from 'react';
import { useListProducts } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SafeProductImage from '@/components/products/SafeProductImage';
import { safeGetAllProductImageURLs, safeGetProductName } from '@/utils/safeProduct';
import type { Product } from '@/backend';

interface GalleryProps {
  onViewProduct: (productId: bigint) => void;
}

interface GalleryImage {
  url: string;
  productId: bigint;
  productName: string;
  isPrimary: boolean;
}

export default function Gallery({ onViewProduct }: GalleryProps) {
  const { data: products = [], isLoading, isError } = useListProducts();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Flatten all product images into a single gallery array, safely
  const galleryImages: GalleryImage[] = products.flatMap((product: Product) => {
    const imageURLs = safeGetAllProductImageURLs(product);
    const productName = safeGetProductName(product);
    
    return imageURLs.map((url, index) => ({
      url,
      productId: product.id,
      productName,
      isPrimary: index === 0,
    }));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background py-8 mt-20">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load gallery images. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 mt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Product Gallery</h1>
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No images available yet. Add products to see them here.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Product Gallery</h1>
          <p className="text-muted-foreground">Browse our complete collection of products</p>
        </div>

        {/* Responsive Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={`${image.productId}-${index}`}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:ring-2 hover:ring-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <SafeProductImage
                src={image.url}
                alt={image.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage?.productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {selectedImage && (
                  <SafeProductImage
                    src={selectedImage.url}
                    alt={selectedImage.productName}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => selectedImage && onViewProduct(selectedImage.productId)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
