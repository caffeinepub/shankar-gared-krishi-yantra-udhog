import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Phone, Mail, Loader2, Minus, Plus } from 'lucide-react';
import { useGetProduct } from '@/hooks/useProducts';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BuyProductProps {
  productId: bigint;
  onBack: () => void;
}

export default function BuyProduct({ productId, onBack }: BuyProductProps) {
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product ? Number(product.price) * quantity : 0;

  const handleCallToOrder = () => {
    window.location.href = 'tel:9928281833';
  };

  const handleEmailOrder = () => {
    if (!product) return;
    
    const subject = encodeURIComponent(`Order Request: ${product.name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI would like to order the following product:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nUnit Price: ₹${product.price.toString()}\nTotal Price: ₹${totalPrice}\n\nPlease contact me to complete this order.\n\nThank you!`
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
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={product.photo.getDirectURL()}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details & Order Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-primary">₹{product.price.toString()}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
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
