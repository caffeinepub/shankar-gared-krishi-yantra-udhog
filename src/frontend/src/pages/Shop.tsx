import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useListProducts } from '@/hooks/useProducts';
import SafeProductImage from '@/components/products/SafeProductImage';
import {
  safeGetProductPhotoURL,
  safeGetProductName,
  safeGetProductDescription,
  safeGetProductPrice,
} from '@/utils/safeProduct';

interface ShopProps {
  onBuyProduct: (productId: bigint) => void;
}

export default function Shop({ onBuyProduct }: ShopProps) {
  const { data: products = [], isLoading } = useListProducts();

  return (
    <div className="min-h-screen bg-background py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shop Our Products</h1>
          <p className="text-muted-foreground">Browse our selection of quality agricultural machinery and hardware</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No products available yet. Please check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const photoURL = safeGetProductPhotoURL(product);
              const name = safeGetProductName(product);
              const description = safeGetProductDescription(product);
              const price = safeGetProductPrice(product);

              return (
                <Card key={product.id.toString()} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <SafeProductImage
                      src={photoURL}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2">{name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
                    <p className="text-2xl font-bold text-primary mt-4">₹{price.toString()}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => onBuyProduct(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
