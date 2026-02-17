import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Upload, Loader2, AlertCircle, Wrench, X } from 'lucide-react';
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAdminStatus';
import { fileToExternalBlob } from '@/lib/fileToExternalBlob';
import { createOpenEndWrenchProducts } from '@/lib/openEndWrenchBulk';
import AccessGate from '@/components/auth/AccessGate';
import type { Product } from '@/backend';
import { ExternalBlob } from '@/backend';

export default function ProductManagement() {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched } = useIsCallerAdmin();
  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkAddProgress, setBulkAddProgress] = useState({ current: 0, total: 0 });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Gallery images state
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<ExternalBlob[]>([]);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoading = isInitializing || isAdminLoading;

  // Show login gate if not authenticated
  if (!isAuthenticated && !isInitializing) {
    return <AccessGate mode="login-required" onLogin={login} />;
  }

  // Show access denied if authenticated but not admin
  if (isAuthenticated && isAdminFetched && !isAdmin) {
    return <AccessGate mode="access-denied" />;
  }

  // Show loading state while checking authentication/authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setEditingProduct(null);
    setErrorMessage(null);
    setSelectedGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryImages([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedGalleryFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryPreview = (index: number) => {
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    });
    setPreviewUrl(product.photo.getDirectURL());
    setExistingGalleryImages(product.gallery || []);
    setIsFormOpen(true);
  };

  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Extract the message after "Reject text: " if present
      const match = error.message.match(/Reject text: (.+)/);
      if (match) {
        return match[1];
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const handleBulkAddWrenches = async () => {
    setErrorMessage(null);
    setIsBulkAdding(true);
    
    try {
      const wrenchProducts = createOpenEndWrenchProducts();
      setBulkAddProgress({ current: 0, total: wrenchProducts.length });

      for (let i = 0; i < wrenchProducts.length; i++) {
        try {
          await createProduct.mutateAsync(wrenchProducts[i]);
          setBulkAddProgress({ current: i + 1, total: wrenchProducts.length });
        } catch (error) {
          console.error(`Failed to create ${wrenchProducts[i].name}:`, error);
          const message = extractErrorMessage(error);
          setErrorMessage(`Failed to create ${wrenchProducts[i].name}: ${message}`);
          break;
        }
      }

      if (!errorMessage) {
        // Success - all products created
        setBulkAddProgress({ current: 0, total: 0 });
      }
    } catch (error) {
      console.error('Bulk add failed:', error);
      const message = extractErrorMessage(error);
      setErrorMessage(`Bulk add failed: ${message}`);
    } finally {
      setIsBulkAdding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    const price = BigInt(formData.price);
    
    try {
      let photoBlob;
      
      if (selectedFile) {
        setUploadProgress(0);
        photoBlob = await fileToExternalBlob(selectedFile);
        photoBlob = photoBlob.withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingProduct) {
        photoBlob = editingProduct.photo;
      } else {
        setErrorMessage('Please select a product photo');
        return;
      }

      // Process gallery images
      const galleryBlobs: ExternalBlob[] = [...existingGalleryImages];
      
      for (const file of selectedGalleryFiles) {
        const blob = await fileToExternalBlob(file);
        galleryBlobs.push(blob);
      }

      const input = {
        name: formData.name,
        description: formData.description,
        price,
        photo: photoBlob,
        gallery: galleryBlobs,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, input });
      } else {
        await createProduct.mutateAsync(input);
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmProduct) return;
    setErrorMessage(null);
    
    try {
      await deleteProduct.mutateAsync(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
      setDeleteConfirmProduct(null);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your product catalog</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleBulkAddWrenches}
              variant="outline"
              disabled={isBulkAdding}
              className="w-full sm:w-auto"
            >
              {isBulkAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Bulk Add Wrenches
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Bulk Add Progress */}
        {isBulkAdding && bulkAddProgress.total > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Adding products: {bulkAddProgress.current} of {bulkAddProgress.total}
                  </span>
                  <span className="font-medium">
                    {Math.round((bulkAddProgress.current / bulkAddProgress.total) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(bulkAddProgress.current / bulkAddProgress.total) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No products yet. Add your first product to get started.</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id.toString()} className="overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={product.photo.getDirectURL()}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <p className="text-2xl font-bold text-primary">₹{product.price.toString()}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  {product.gallery && product.gallery.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-4">
                      +{product.gallery.length} gallery {product.gallery.length === 1 ? 'image' : 'images'}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirmProduct(product)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Photo */}
              <div>
                <Label htmlFor="photo">Primary Product Photo *</Label>
                <div className="mt-2 space-y-4">
                  {previewUrl && (
                    <div className="aspect-square w-full max-w-xs overflow-hidden rounded-lg bg-muted">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <Label htmlFor="gallery">Gallery Images (Optional)</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Add multiple images to showcase your product from different angles
                </p>
                
                {/* Existing Gallery Images */}
                {existingGalleryImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Gallery Images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingGalleryImages.map((blob, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
                          <img
                            src={blob.getDirectURL()}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryImage(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Gallery Images Preview */}
                {galleryPreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">New Images to Add:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryPreview(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    id="gallery"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleGalleryFilesSelect}
                    className="flex-1"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Open End Wrench 10x11 mm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product features, specifications, and benefits..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 150"
                  required
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingProduct ? 'Update Product' : 'Create Product'}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirmProduct} onOpenChange={() => setDeleteConfirmProduct(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteConfirmProduct?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
