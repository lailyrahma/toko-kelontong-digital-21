
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface BundleProduct {
  productId: string;
  productName: string;
  quantity: number;
}

interface Bundle {
  id: string;
  name: string;
  products: BundleProduct[];
  price: number;
  image?: string;
  isAvailable: boolean;
}

interface BundleManagementProps {
  products: Product[];
  onBundleChange?: (bundles: Bundle[]) => void;
}

const BundleManagement = ({ products, onBundleChange }: BundleManagementProps) => {
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: 'b1',
      name: 'Paket Hemat Sembako',
      products: [
        { productId: '1', productName: 'Beras Premium 5kg', quantity: 1 },
        { productId: '2', productName: 'Minyak Goreng 1L', quantity: 2 },
        { productId: '3', productName: 'Gula Pasir 1kg', quantity: 1 }
      ],
      price: 99000,
      isAvailable: true
    },
    {
      id: 'b2',
      name: 'Paket Sarapan Praktis',
      products: [
        { productId: '4', productName: 'Indomie Goreng', quantity: 5 },
        { productId: '5', productName: 'Teh Botol Sosro', quantity: 3 }
      ],
      price: 29500,
      isAvailable: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [bundleForm, setBundleForm] = useState({
    name: '',
    price: '',
    products: [] as BundleProduct[]
  });

  const { toast } = useToast();

  const updateBundles = (newBundles: Bundle[]) => {
    setBundles(newBundles);
    onBundleChange?.(newBundles);
  };

  const handleCreateBundle = () => {
    setEditingBundle(null);
    setBundleForm({
      name: '',
      price: '',
      products: []
    });
    setIsDialogOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setBundleForm({
      name: bundle.name,
      price: bundle.price.toString(),
      products: [...bundle.products]
    });
    setIsDialogOpen(true);
  };

  const handleAddProduct = () => {
    setBundleForm(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', productName: '', quantity: 1 }]
    }));
  };

  const handleUpdateBundleProduct = (index: number, field: keyof BundleProduct, value: string | number) => {
    setBundleForm(prev => ({
      ...prev,
      products: prev.products.map((product, i) => {
        if (i === index) {
          if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);
            return {
              ...product,
              productId: value as string,
              productName: selectedProduct?.name || ''
            };
          }
          return { ...product, [field]: value };
        }
        return product;
      })
    }));
  };

  const handleRemoveBundleProduct = (index: number) => {
    setBundleForm(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBundle = () => {
    if (!bundleForm.name.trim() || !bundleForm.price || bundleForm.products.length === 0) {
      toast({
        title: "Kesalahan",
        description: "Harap lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    // Validate that all products are selected
    const invalidProducts = bundleForm.products.filter(p => !p.productId);
    if (invalidProducts.length > 0) {
      toast({
        title: "Kesalahan",
        description: "Harap pilih produk untuk semua item",
        variant: "destructive",
      });
      return;
    }

    const newBundle: Bundle = {
      id: editingBundle ? editingBundle.id : `b${Date.now()}`,
      name: bundleForm.name.trim(),
      price: parseInt(bundleForm.price),
      products: bundleForm.products.filter(p => p.productId), // Only include valid products
      isAvailable: editingBundle ? editingBundle.isAvailable : true
    };

    let newBundles;
    if (editingBundle) {
      newBundles = bundles.map(b => b.id === editingBundle.id ? newBundle : b);
      toast({
        title: "Berhasil",
        description: "Bundle berhasil diperbarui",
      });
    } else {
      newBundles = [...bundles, newBundle];
      toast({
        title: "Berhasil",
        description: "Bundle berhasil dibuat",
      });
    }

    updateBundles(newBundles);
    setIsDialogOpen(false);
    // Reset form
    setBundleForm({
      name: '',
      price: '',
      products: []
    });
    setEditingBundle(null);
  };

  const toggleBundleAvailability = (bundleId: string) => {
    const newBundles = bundles.map(bundle => 
      bundle.id === bundleId 
        ? { ...bundle, isAvailable: !bundle.isAvailable }
        : bundle
    );
    updateBundles(newBundles);
    toast({
      title: "Berhasil",
      description: "Status bundle berhasil diubah",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manajemen Bundle</h3>
          <p className="text-sm text-muted-foreground">Kelola paket produk bundling</p>
        </div>
        <Button onClick={handleCreateBundle} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Bundle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{bundle.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={bundle.isAvailable ? "secondary" : "destructive"}
                    className="cursor-pointer"
                    onClick={() => toggleBundleAvailability(bundle.id)}
                  >
                    {bundle.isAvailable ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Rp {bundle.price.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hemat: Rp {Math.max(0, calculateBundleValue(bundle.products) - bundle.price).toLocaleString('id-ID')}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-2">Produk dalam bundle:</p>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {bundle.products.map((product, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-gray-50 p-1 rounded">
                      {product.productName} ({product.quantity}x)
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBundle(bundle)}
                  className="flex-1 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBundle(bundle.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setBundleForm({ name: '', price: '', products: [] });
          setEditingBundle(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBundle ? 'Edit Bundle' : 'Buat Bundle Baru'}
            </DialogTitle>
            <DialogDescription>
              Atur produk yang akan digabung dalam satu paket bundle
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bundleName">Nama Bundle *</Label>
                <Input
                  id="bundleName"
                  value={bundleForm.name}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama bundle"
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundlePrice">Harga Bundle (Rp) *</Label>
                <Input
                  id="bundlePrice"
                  type="number"
                  value={bundleForm.price}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Masukkan harga bundle"
                  min="0"
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Produk dalam Bundle *</Label>
                <Button 
                  type="button" 
                  onClick={handleAddProduct} 
                  size="sm"
                  variant="outline"
                  className="hover:bg-blue-50"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Tambah Produk
                </Button>
              </div>

              {bundleForm.products.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada produk dipilih</p>
                </div>
              ) : (
                bundleForm.products.map((bundleProduct, index) => (
                  <div key={index} className="flex items-end space-x-2 p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <Label className="text-xs">Produk *</Label>
                      <Select
                        value={bundleProduct.productId}
                        onValueChange={(value) => handleUpdateBundleProduct(index, 'productId', value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .filter(product => 
                              // Don't show products that are already selected in other bundle items
                              !bundleForm.products.some((bp, i) => i !== index && bp.productId === product.id)
                            )
                            .map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - Rp {product.price.toLocaleString('id-ID')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label className="text-xs">Jumlah *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={bundleProduct.quantity}
                        onChange={(e) => handleUpdateBundleProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBundleProduct(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {bundleForm.products.length > 0 && bundleForm.price && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-sm mb-2">Ringkasan Bundle:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total nilai produk:</span>
                    <span>Rp {calculateBundleValue(bundleForm.products).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Harga bundle:</span>
                    <span>Rp {parseInt(bundleForm.price || '0').toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Penghematan:</span>
                    <span>Rp {Math.max(0, calculateBundleValue(bundleForm.products) - parseInt(bundleForm.price || '0')).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button 
              onClick={handleSaveBundle} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!bundleForm.name.trim() || !bundleForm.price || bundleForm.products.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingBundle ? 'Update Bundle' : 'Simpan Bundle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BundleManagement;
