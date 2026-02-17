import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Phone, Mail, Loader2, Minus, Plus } from 'lucide-react';
import { useGetProduct } from '@/hooks/useProducts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SafeProductImage from '@/components/products/SafeProductImage';
import {
  safeGetAllProductImageURLs,
  safeGetProductName,
  safeGetProductDescription,
  safeGetProductPrice,
} from '@/utils/safeProduct';

interface BuyProductProps {
  productId: bigint;
  onBack: () => void;
}

export default function BuyProduct({ productId, onBack }: BuyProductProps) {
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Safely extract all image URLs
  const allImageURLs = safeGetAllProductImageURLs(product);
  const hasGallery = allImageURLs.length > 1;

  // Clamp selected image index when images change
  useEffect(() => {
    if (selectedImageIndex >= allImageURLs.length && allImageURLs.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [allImageURLs.length, selectedImageIndex]);

  const name = safeGetProductName(product);
  const description = safeGetProductDescription(product);
  const price = safeGetProductPrice(product);
  const totalPrice = Number(price) * quantity;

  const handleCallToOrder = () => {
    window.location.href = 'tel:9928281833';
  };

  const handleEmailOrder = () => {
    const subject = encodeURIComponent(`Order Request: ${name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI would like to order the following product:\n\nProduct: ${name}\nQuantity: ${quantity}\nUnit Price: ₹${price.toString()}\nTotal Price: ₹${totalPrice}\n\nPlease contact me to complete this order.\n\nThank you!`
    );
    
    window.location.href = `mailto:sgkyu@gmail.com?subject=${subject}&body=${body}`;
  };

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

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background py-8 mt-20">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Product not found or failed to load. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {allImageURLs.length > 0 ? (
                <SafeProductImage
                  src={allImageURLs[selectedImageIndex] || null}
                  alt={name}
                  className="w-full h-full object-cover"
                  placeholderClassName="w-full h-full"
                />
              ) : (
                <SafeProductImage
                  src={null}
                  alt={name}
                  placeholderClassName="w-full h-full"
                />
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasGallery && (
              <div className="grid grid-cols-5 gap-2">
                {allImageURLs.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md bg-muted transition-all ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-primary'
                        : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                  >
                    <SafeProductImage
                      src={imageUrl}
                      alt={`${name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Order Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{name}</h1>
              <p className="text-2xl font-bold text-primary">₹{price.toString()}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-24 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-foreground">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleCallToOrder}
                    className="w-full"
                    size="lg"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call to Order
                  </Button>
                  <Button
                    onClick={handleEmailOrder}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Order Request
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Contact us via phone or email to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
