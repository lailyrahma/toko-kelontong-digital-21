
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
}

const BundleManagement = ({ products }: BundleManagementProps) => {
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
    if (!bundleForm.name || !bundleForm.price || bundleForm.products.length === 0) {
      toast({
        title: "Kesalahan",
        description: "Harap lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    const newBundle: Bundle = {
      id: editingBundle ? editingBundle.id : `b${Date.now()}`,
      name: bundleForm.name,
      price: parseInt(bundleForm.price),
      products: bundleForm.products,
      isAvailable: true
    };

    if (editingBundle) {
      setBundles(bundles.map(b => b.id === editingBundle.id ? newBundle : b));
      toast({
        title: "Berhasil",
        description: "Bundle berhasil diperbarui",
      });
    } else {
      setBundles([...bundles, newBundle]);
      toast({
        title: "Berhasil",
        description: "Bundle berhasil dibuat",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteBundle = (bundleId: string) => {
    setBundles(bundles.filter(b => b.id !== bundleId));
    toast({
      title: "Berhasil",
      description: "Bundle berhasil dihapus",
    });
  };

  const calculateBundleValue = (bundleProducts: BundleProduct[]) => {
    return bundleProducts.reduce((total, bundleProduct) => {
      const product = products.find(p => p.id === bundleProduct.productId);
      return total + (product ? product.price * bundleProduct.quantity : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manajemen Bundle</h3>
          <p className="text-sm text-muted-foreground">Kelola paket produk bundling</p>
        </div>
        <Button onClick={handleCreateBundle}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Bundle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bundles.map((bundle) => (
          <Card key={bundle.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{bundle.name}</CardTitle>
                <Badge variant={bundle.isAvailable ? "secondary" : "destructive"}>
                  {bundle.isAvailable ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Rp {bundle.price.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hemat: Rp {(calculateBundleValue(bundle.products) - bundle.price).toLocaleString('id-ID')}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-2">Produk dalam bundle:</p>
                <div className="space-y-1">
                  {bundle.products.map((product, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
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
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBundle(bundle.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Label htmlFor="bundleName">Nama Bundle</Label>
                <Input
                  id="bundleName"
                  value={bundleForm.name}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama bundle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundlePrice">Harga Bundle</Label>
                <Input
                  id="bundlePrice"
                  type="number"
                  value={bundleForm.price}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Masukkan harga bundle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Produk dalam Bundle</Label>
                <Button type="button" onClick={handleAddProduct} size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Tambah Produk
                </Button>
              </div>

              {bundleForm.products.map((bundleProduct, index) => (
                <div key={index} className="flex items-end space-x-2 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs">Produk</Label>
                    <Select
                      value={bundleProduct.productId}
                      onValueChange={(value) => handleUpdateBundleProduct(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - Rp {product.price.toLocaleString('id-ID')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20">
                    <Label className="text-xs">Jumlah</Label>
                    <Input
                      type="number"
                      min="1"
                      value={bundleProduct.quantity}
                      onChange={(e) => handleUpdateBundleProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveBundleProduct(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {bundleForm.products.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total nilai produk:</span>
                  <span>Rp {calculateBundleValue(bundleForm.products).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Harga bundle:</span>
                  <span>Rp {parseInt(bundleForm.price || '0').toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Penghematan:</span>
                  <span>Rp {Math.max(0, calculateBundleValue(bundleForm.products) - parseInt(bundleForm.price || '0')).toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSaveBundle} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {editingBundle ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BundleManagement;
