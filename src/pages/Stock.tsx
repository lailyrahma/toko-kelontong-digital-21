
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Pencil, Package, AlertTriangle, X, FileImage, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import BarcodeScanner from '@/components/products/BarcodeScanner';
import ProductImageUpload from '@/components/products/ProductImageUpload';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface BundleProduct {
  id: string;
  name: string;
  products: { productId: string; quantity: number; productName: string }[];
  price: number;
  image?: string;
  isAvailable: boolean;
}

const Stock = () => {
  const { user } = useUser();
  const isOwner = user?.role === 'pemilik';
  
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Beras Premium 5kg', category: 'Sembako', price: 75000, stock: 20, barcode: '1234567890123', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop' },
    { id: '2', name: 'Minyak Goreng 1L', category: 'Sembako', price: 18000, stock: 5, barcode: '1234567890124', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop' },
    { id: '3', name: 'Gula Pasir 1kg', category: 'Sembako', price: 14000, stock: 0, barcode: '1234567890125' },
    { id: '4', name: 'Indomie Goreng', category: 'Makanan Instan', price: 3500, stock: 100, barcode: '1234567890126', image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop' },
    { id: '5', name: 'Teh Botol Sosro', category: 'Minuman', price: 4000, stock: 8, barcode: '1234567890127', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop' },
    { id: '6', name: 'Sabun Mandi Lifebuoy', category: 'Kebersihan', price: 8500, stock: 30, barcode: '1234567890128' },
  ]);

  const [bundles, setBundles] = useState<BundleProduct[]>([
    {
      id: '1',
      name: 'Paket Hemat Sembako',
      products: [
        { productId: '1', quantity: 1, productName: 'Beras Premium 5kg' },
        { productId: '2', quantity: 2, productName: 'Minyak Goreng 1L' },
        { productId: '3', quantity: 1, productName: 'Gula Pasir 1kg' }
      ],
      price: 99000,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
      isAvailable: false
    },
    {
      id: '2',
      name: 'Paket Minuman Segar',
      products: [
        { productId: '5', quantity: 3, productName: 'Teh Botol Sosro' }
      ],
      price: 10000,
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop',
      isAvailable: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBundleDialog, setShowAddBundleDialog] = useState(false);
  const [showEditBundleDialog, setShowEditBundleDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBundle, setEditingBundle] = useState<BundleProduct | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    barcode: '',
    image: ''
  });

  const [newBundle, setNewBundle] = useState<Omit<BundleProduct, 'id' | 'isAvailable'>>({
    name: '',
    products: [],
    price: 0,
    image: ''
  });

  const [selectedBundleProducts, setSelectedBundleProducts] = useState<{ productId: string; quantity: number }[]>([]);

  const { toast } = useToast();

  const categories = ['Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan', 'Snack', 'Frozen Food'];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Habis', variant: 'destructive' as const, className: 'stock-empty' };
    if (stock < 10) return { status: 'Sedikit', variant: 'secondary' as const, className: 'stock-low' };
    if (stock <= 50) return { status: 'Normal', variant: 'secondary' as const, className: 'stock-normal' };
    return { status: 'Banyak', variant: 'secondary' as const, className: 'stock-abundant' };
  };

  const getBundleAvailability = (bundle: BundleProduct) => {
    return bundle.products.every(item => {
      const product = products.find(p => p.id === item.productId);
      return product && product.stock >= item.quantity;
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    let matchesStock = true;
    if (filterStock === 'empty') matchesStock = product.stock === 0;
    else if (filterStock === 'low') matchesStock = product.stock > 0 && product.stock < 10;
    else if (filterStock === 'normal') matchesStock = product.stock >= 10 && product.stock <= 50;
    else if (filterStock === 'abundant') matchesStock = product.stock > 50;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const stockSummary = {
    total: products.length,
    empty: products.filter(p => p.stock === 0).length,
    low: products.filter(p => p.stock > 0 && p.stock < 10).length,
    normal: products.filter(p => p.stock >= 10 && p.stock <= 50).length,
    abundant: products.filter(p => p.stock > 50).length,
  };

  const handleImageUpdate = (productId: string, imageUrl: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, image: imageUrl } : p
    ));
  };

  const handleBarcodeScanned = (barcode: string) => {
    setNewProduct({...newProduct, barcode});
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi semua field dengan benar",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', category: '', price: 0, stock: 0, barcode: '', image: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} berhasil ditambahkan`,
    });
  };

  const handleAddBundle = () => {
    if (!newBundle.name || selectedBundleProducts.length === 0 || newBundle.price <= 0) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi semua field dengan benar",
        variant: "destructive",
      });
      return;
    }

    const bundleProducts = selectedBundleProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.name || ''
      };
    });

    const bundle: BundleProduct = {
      ...newBundle,
      id: Date.now().toString(),
      products: bundleProducts,
      isAvailable: getBundleAvailability({ ...newBundle, id: '', products: bundleProducts, isAvailable: true })
    };

    setBundles([...bundles, bundle]);
    setNewBundle({ name: '', products: [], price: 0, image: '' });
    setSelectedBundleProducts([]);
    setShowAddBundleDialog(false);
    
    toast({
      title: "Bundling Ditambahkan",
      description: `${bundle.name} berhasil ditambahkan`,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct || !isOwner) return;

    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    
    setEditingProduct(null);
    setShowEditDialog(false);
    
    toast({
      title: "Produk Diperbarui",
      description: "Data produk berhasil diperbarui",
    });
  };

  const startEdit = (product: Product) => {
    if (!isOwner) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya pemilik yang dapat mengedit produk",
        variant: "destructive",
      });
      return;
    }
    setEditingProduct({ ...product });
    setShowEditDialog(true);
  };

  const startEditBundle = (bundle: BundleProduct) => {
    setEditingBundle({ ...bundle });
    setSelectedBundleProducts(bundle.products.map(p => ({ productId: p.productId, quantity: p.quantity })));
    setShowEditBundleDialog(true);
  };

  const handleDeleteBundle = (bundleId: string) => {
    setBundles(bundles.filter(b => b.id !== bundleId));
    toast({
      title: "Bundling Dihapus",
      description: "Bundling berhasil dihapus",
    });
  };

  const addProductToBundle = () => {
    setSelectedBundleProducts([...selectedBundleProducts, { productId: '', quantity: 1 }]);
  };

  const updateBundleProduct = (index: number, productId: string, quantity: number) => {
    const updated = [...selectedBundleProducts];
    updated[index] = { productId, quantity };
    setSelectedBundleProducts(updated);
  };

  const removeBundleProduct = (index: number) => {
    setSelectedBundleProducts(selectedBundleProducts.filter((_, i) => i !== index));
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Kelola Stok Produk</h1>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          {/* Role-based Access Notice */}
          {!isOwner && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm">
                    <strong>Info:</strong> Sebagai kasir, Anda dapat melihat stok produk, namun hanya pemilik yang dapat menambah atau mengedit produk.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Produk Satuan</TabsTrigger>
              {isOwner && <TabsTrigger value="bundles">Bundling Produk</TabsTrigger>}
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <div></div>
                {isOwner && (
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tambah Produk Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <ProductImageUpload
                          productId="new"
                          category={newProduct.category.toLowerCase()}
                          onImageUpdate={(_, imageUrl) => setNewProduct({...newProduct, image: imageUrl})}
                        />

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nama Produk</Label>
                            <Input
                              id="name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              placeholder="Masukkan nama produk"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Kategori</Label>
                            <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="price">Harga</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                              placeholder="Masukkan harga"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stok</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                              placeholder="Masukkan stok"
                            />
                          </div>
                          <div>
                            <Label htmlFor="barcode">Barcode</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="barcode"
                                value={newProduct.barcode}
                                onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                                placeholder="Masukkan barcode"
                                className="flex-1"
                              />
                              <BarcodeScanner 
                                onBarcodeScanned={handleBarcodeScanned}
                                currentBarcode={newProduct.barcode}
                              />
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleAddProduct} className="w-full">
                          Tambah Produk
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Stock Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stockSummary.total}</div>
                    <div className="text-sm text-muted-foreground">Total Produk</div>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stockSummary.empty}</div>
                    <div className="text-sm text-muted-foreground">Habis</div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stockSummary.low}</div>
                    <div className="text-sm text-muted-foreground">Sedikit</div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stockSummary.normal}</div>
                    <div className="text-sm text-muted-foreground">Normal</div>
                  </CardContent>
                </Card>
                <Card className="border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stockSummary.abundant}</div>
                    <div className="text-sm text-muted-foreground">Banyak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Produk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari produk atau barcode..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStock} onValueChange={setFilterStock}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Status Stok" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Stok</SelectItem>
                        <SelectItem value="empty">Habis</SelectItem>
                        <SelectItem value="low">Sedikit (&lt;10)</SelectItem>
                        <SelectItem value="normal">Normal (10-50)</SelectItem>
                        <SelectItem value="abundant">Banyak (&gt;50)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const stockInfo = getStockStatus(product.stock);
                  return (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-3">
                          <div className="aspect-square bg-gray-100 rounded-lg w-20 h-20 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex space-x-1">
                            {isOwner && (
                              <>
                                <ProductImageUpload
                                  productId={product.id}
                                  currentImage={product.image}
                                  category={product.category.toLowerCase()}
                                  onImageUpdate={handleImageUpdate}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEdit(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {!isOwner && (
                              <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                View Only
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Harga:</span>
                            <span className="font-medium">Rp {product.price.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Stok:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{product.stock}</span>
                              <Badge variant={stockInfo.variant} className={stockInfo.className}>
                                {stockInfo.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Barcode:</span>
                            <span className="text-xs font-mono">{product.barcode}</span>
                          </div>
                        </div>
                        {product.stock === 0 && (
                          <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center text-red-700 text-sm">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Stok habis, segera restock!
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Bundles Tab - Owner Only */}
            {isOwner && (
              <TabsContent value="bundles" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Bundling Produk</h2>
                  <Dialog open={showAddBundleDialog} onOpenChange={setShowAddBundleDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Bundling
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tambah Bundling Produk</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="bundleName">Nama Bundling</Label>
                          <Input
                            id="bundleName"
                            value={newBundle.name}
                            onChange={(e) => setNewBundle({...newBundle, name: e.target.value})}
                            placeholder="Masukkan nama bundling"
                          />
                        </div>

                        <div>
                          <Label>Produk dalam Bundling</Label>
                          <div className="space-y-3">
                            {selectedBundleProducts.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                                <Select
                                  value={item.productId}
                                  onValueChange={(value) => updateBundleProduct(index, value, item.quantity)}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Pilih produk" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.map(product => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.name} - Stok: {product.stock}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateBundleProduct(index, item.productId, parseInt(e.target.value) || 1)}
                                  className="w-20"
                                  placeholder="Qty"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeBundleProduct(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={addProductToBundle}
                              className="w-full"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Tambah Produk
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bundlePrice">Harga Bundling</Label>
                          <Input
                            id="bundlePrice"
                            type="number"
                            value={newBundle.price}
                            onChange={(e) => setNewBundle({...newBundle, price: parseInt(e.target.value) || 0})}
                            placeholder="Masukkan harga bundling"
                          />
                        </div>

                        <Button onClick={handleAddBundle} className="w-full">
                          Tambah Bundling
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Bundles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bundles.map((bundle) => {
                    const isAvailable = getBundleAvailability(bundle);
                    return (
                      <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-3">
                            <div className="aspect-square bg-gray-100 rounded-lg w-20 h-20 flex items-center justify-center overflow-hidden">
                              {bundle.image ? (
                                <img 
                                  src={bundle.image} 
                                  alt={bundle.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-10 w-10 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditBundle(bundle)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBundle(bundle.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-medium mb-2">{bundle.name}</h3>
                          <Badge className="mb-2">Bundling</Badge>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Komposisi:</span>
                              <div className="text-sm text-muted-foreground">
                                {bundle.products.map(item => `${item.productName} (${item.quantity}x)`).join(', ')}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Harga:</span>
                              <span className="font-medium">Rp {bundle.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Status:</span>
                              <Badge variant={isAvailable ? 'secondary' : 'destructive'}>
                                {isAvailable ? 'Tersedia' : 'Tidak Cukup Stok'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {bundles.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Belum ada bundling produk</p>
                    <p className="text-sm text-muted-foreground">Buat bundling pertama Anda!</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </main>

        {/* Edit Product Dialog */}
        {isOwner && editingProduct && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Produk</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <ProductImageUpload
                  productId={editingProduct.id}
                  currentImage={editingProduct.image}
                  category={editingProduct.category.toLowerCase()}
                  onImageUpdate={(_, imageUrl) => setEditingProduct({...editingProduct, image: imageUrl})}
                />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nama Produk</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Kategori</Label>
                    <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Harga</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stok</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-barcode">Barcode</Label>
                    <Input
                      id="edit-barcode"
                      value={editingProduct.barcode}
                      onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button onClick={handleEditProduct} className="flex-1">
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Stock;
