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
import { Search, Plus, Pencil, Package, AlertTriangle, X, FileImage, Upload, ShoppingBag } from 'lucide-react';
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
  stock: number;
  image?: string;
  description: string;
}

const Stock = () => {
  const { user } = useUser();
  const isOwner = user?.role === 'pemilik';
  
  const [activeTab, setActiveTab] = useState('products');
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
      id: 'bundle1',
      name: 'Paket Sembako Lengkap',
      products: [
        { productId: '1', quantity: 1, productName: 'Beras Premium 5kg' },
        { productId: '2', quantity: 2, productName: 'Minyak Goreng 1L' },
        { productId: '3', quantity: 1, productName: 'Gula Pasir 1kg' }
      ],
      price: 100000,
      stock: 15,
      description: 'Paket sembako lengkap untuk kebutuhan sehari-hari',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop'
    },
    {
      id: 'bundle2',
      name: 'Paket Mie Instan',
      products: [
        { productId: '4', quantity: 5, productName: 'Indomie Goreng' },
        { productId: '5', quantity: 2, productName: 'Teh Botol Sosro' }
      ],
      price: 25000,
      stock: 8,
      description: 'Paket mie instan dengan minuman',
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBundleDialog, setShowAddBundleDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    barcode: '',
    image: ''
  });

  const [newBundle, setNewBundle] = useState<Omit<BundleProduct, 'id'>>({
    name: '',
    products: [],
    price: 0,
    stock: 0,
    description: '',
    image: ''
  });

  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const categories = ['Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan', 'Snack', 'Frozen Food'];

  // Placeholder images untuk demo
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1574781330855-d0db1d65d95b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
  ];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Habis', variant: 'destructive' as const, className: 'stock-empty' };
    if (stock < 10) return { status: 'Sedikit', variant: 'secondary' as const, className: 'stock-low' };
    if (stock <= 50) return { status: 'Normal', variant: 'secondary' as const, className: 'stock-normal' };
    return { status: 'Banyak', variant: 'secondary' as const, className: 'stock-abundant' };
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

  const filteredBundles = bundles.filter(bundle => 
    bundle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockSummary = {
    total: products.length,
    empty: products.filter(p => p.stock === 0).length,
    low: products.filter(p => p.stock > 0 && p.stock < 10).length,
    normal: products.filter(p => p.stock >= 10 && p.stock <= 50).length,
    abundant: products.filter(p => p.stock > 50).length,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "File Tidak Valid",
          description: "Harap pilih file gambar (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 2MB",
          variant: "destructive",
        });
        return;
      }

      // Buat URL untuk preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setNewProduct({...newProduct, image: e.target.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
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
    setSelectedImage('');
    setShowAddDialog(false);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} berhasil ditambahkan`,
    });
  };

  const handleAddBundle = () => {
    if (!newBundle.name || newBundle.products.length === 0 || newBundle.price <= 0) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi semua field dengan benar",
        variant: "destructive",
      });
      return;
    }

    const bundle: BundleProduct = {
      ...newBundle,
      id: Date.now().toString(),
    };

    setBundles([...bundles, bundle]);
    setNewBundle({ name: '', products: [], price: 0, stock: 0, description: '', image: '' });
    setShowAddBundleDialog(false);
    
    toast({
      title: "Bundle Ditambahkan",
      description: `${bundle.name} berhasil ditambahkan`,
    });
  };

  const addProductToBundle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = newBundle.products.findIndex(p => p.productId === productId);
    if (existingIndex >= 0) {
      const updatedProducts = [...newBundle.products];
      updatedProducts[existingIndex].quantity += 1;
      setNewBundle({ ...newBundle, products: updatedProducts });
    } else {
      setNewBundle({
        ...newBundle,
        products: [...newBundle.products, { productId, quantity: 1, productName: product.name }]
      });
    }
  };

  const removeProductFromBundle = (productId: string) => {
    const updatedProducts = newBundle.products.filter(p => p.productId !== productId);
    setNewBundle({ ...newBundle, products: updatedProducts });
  };

  const handleImageUpdate = (productId: string, imageUrl: string) => {
    if (activeTab === 'products') {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, image: imageUrl } : p
      ));
    }
    toast({
      title: "Foto Diperbarui",
      description: "Foto produk berhasil diperbarui",
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct || !isOwner) return;

    const updatedProduct = { ...editingProduct, image: selectedImage || undefined };
    setProducts(products.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    ));
    
    setEditingProduct(null);
    setSelectedImage('');
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
    setSelectedImage(product.image || '');
    setShowEditDialog(true);
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
  };

  const handleSelectImageForNewProduct = (image: string) => {
    setSelectedImage(image);
    setNewProduct({...newProduct, image: image});
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="products" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Produk Satuan</span>
                </TabsTrigger>
                {isOwner && (
                  <TabsTrigger value="bundles" className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Bundling Produk</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {isOwner && (
                <div className="flex space-x-2">
                  {activeTab === 'products' && (
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
                          {/* Photo Selection for New Product */}
                          <div className="space-y-4">
                            <Label>Foto Produk</Label>
                            {selectedImage && (
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                      <img 
                                        src={selectedImage} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">Foto Dipilih</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedImage('');
                                        setNewProduct({...newProduct, image: ''});
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* File Upload Section */}
                            <Card>
                              <CardContent className="p-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-600 mb-2">Upload foto dari laptop</p>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <FileImage className="h-4 w-4 mr-2" />
                                    Pilih File
                                  </Button>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Format: JPG, PNG (Max 2MB)
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            <div>
                              <h4 className="text-sm font-medium mb-3">Atau pilih foto dari galeri:</h4>
                              <div className="grid grid-cols-4 gap-2">
                                {placeholderImages.map((image, index) => (
                                  <Card 
                                    key={index}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                      selectedImage === image ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => {
                                      setSelectedImage(image);
                                      setNewProduct({...newProduct, image});
                                    }}
                                  >
                                    <CardContent className="p-2">
                                      <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                        <img 
                                          src={image} 
                                          alt={`Option ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            <Card 
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedImage === '' ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => {
                                setSelectedImage('');
                                setNewProduct({...newProduct, image: ''});
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Tanpa Foto</p>
                                    <p className="text-xs text-muted-foreground">Gunakan icon default</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Product Details */}
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

                  {activeTab === 'bundles' && (
                    <Dialog open={showAddBundleDialog} onOpenChange={setShowAddBundleDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Bundling
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                            <Label htmlFor="bundleDescription">Deskripsi</Label>
                            <Input
                              id="bundleDescription"
                              value={newBundle.description}
                              onChange={(e) => setNewBundle({...newBundle, description: e.target.value})}
                              placeholder="Masukkan deskripsi bundling"
                            />
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
                          <div>
                            <Label htmlFor="bundleStock">Stok Bundling</Label>
                            <Input
                              id="bundleStock"
                              type="number"
                              value={newBundle.stock}
                              onChange={(e) => setNewBundle({...newBundle, stock: parseInt(e.target.value) || 0})}
                              placeholder="Masukkan stok bundling"
                            />
                          </div>

                          <div>
                            <Label>Pilih Produk untuk Bundling</Label>
                            <div className="max-h-60 overflow-y-auto border rounded-md p-4 space-y-2">
                              {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">{product.name} - Rp {product.price.toLocaleString('id-ID')}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addProductToBundle(product.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {newBundle.products.length > 0 && (
                            <div>
                              <Label>Produk dalam Bundle</Label>
                              <div className="space-y-2">
                                {newBundle.products.map(item => (
                                  <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{item.productName} x {item.quantity}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeProductFromBundle(item.productId)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button onClick={handleAddBundle} className="w-full">
                            Tambah Bundling
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>

            <TabsContent value="products">
              {/* Stock Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <Card className="mb-6">
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
                          {isOwner && (
                            <div className="flex flex-col space-y-2">
                              <ProductImageUpload
                                productId={product.id}
                                currentImage={product.image}
                                category={product.category}
                                onImageUpdate={handleImageUpdate}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct({ ...product });
                                  setSelectedImage(product.image || '');
                                  setShowEditDialog(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Tidak ada produk yang ditemukan</p>
                </div>
              )}
            </TabsContent>

            {isOwner && (
              <TabsContent value="bundles">
                {/* Bundles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBundles.map((bundle) => {
                    const stockInfo = getStockStatus(bundle.stock);
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
                                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Badge variant="secondary" className="text-xs">Bundling</Badge>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-medium mb-2 line-clamp-2">{bundle.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{bundle.description}</p>
                          
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2">Komposisi:</h4>
                            <div className="space-y-1">
                              {bundle.products.map((item, index) => (
                                <div key={index} className="text-xs text-muted-foreground">
                                  • {item.productName} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Harga:</span>
                              <span className="font-medium">Rp {bundle.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Stok:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{bundle.stock}</span>
                                <Badge variant={stockInfo.variant} className={stockInfo.className}>
                                  {stockInfo.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {bundle.stock === 0 && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center text-red-700 text-sm">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Stok bundling habis!
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredBundles.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Belum ada bundling produk yang dibuat</p>
                    <p className="text-sm text-muted-foreground mt-2">Klik "Tambah Bundling" untuk membuat paket produk</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </main>

        {/* Edit Product Dialog - Only for Owner */}
        {isOwner && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Produk</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                <div className="space-y-6">
                  {/* Product Image Section */}
                  <div className="space-y-4">
                    <Label>Foto Produk</Label>
                    {selectedImage && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Foto Saat Ini</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-3">Pilih foto dari galeri:</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {placeholderImages.map((image, index) => (
                          <Card 
                            key={index}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedImage === image ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedImage(image)}
                          >
                            <CardContent className="p-2">
                              <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`Option ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedImage === '' ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedImage('')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Tanpa Foto</p>
                            <p className="text-xs text-muted-foreground">Gunakan icon default</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Product Details Section */}
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
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Stock;
