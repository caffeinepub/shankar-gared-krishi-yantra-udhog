/**
 * Fallback view for invalid app view state that displays clear messaging
 * and a recovery action to return to the shop.
 */

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

interface InvalidStateFallbackProps {
  onReturnToShop: () => void;
}

export default function InvalidStateFallback({ onReturnToShop }: InvalidStateFallbackProps) {
  return (
    <div className="min-h-screen bg-background py-8 mt-20">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning" />
              <CardTitle>Page Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or the content is unavailable.
              Please return to the shop to browse our products.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={onReturnToShop} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Return to Shop
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
