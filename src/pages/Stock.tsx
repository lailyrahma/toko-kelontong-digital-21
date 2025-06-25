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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface Bundle {
  id: string;
  name: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
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
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBundleDialog, setShowAddBundleDialog] = useState(false);
  const [showEditBundleDialog, setShowEditBundleDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    barcode: '',
    image: ''
  });
  const [newBundle, setNewBundle] = useState<Omit<Bundle, 'id' | 'isAvailable'>>({
    name: '',
    products: [],
    price: 0,
    image: ''
  });

  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const categories = ['Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan', 'Snack', 'Frozen Food'];

  // Image library organized by category
  const imageLibrary = {
    'Sembako': [
      { url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop', name: 'Beras' },
      { url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop', name: 'Minyak' },
      { url: 'https://images.unsplash.com/photo-1574781330855-d0db1d65d95b?w=200&h=200&fit=crop', name: 'Gula' },
      { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop', name: 'Tepung' }
    ],
    'Makanan Instan': [
      { url: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop', name: 'Mie Instan' },
      { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop', name: 'Snack' }
    ],
    'Minuman': [
      { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop', name: 'Teh' },
      { url: 'https://images.unsplash.com/photo-1544968503-0773b4000fcc?w=200&h=200&fit=crop', name: 'Air Mineral' }
    ],
    'Kebersihan': [
      { url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop', name: 'Sabun' },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', name: 'Detergen' }
    ]
  };

  const getAllImages = () => {
    return Object.values(imageLibrary).flat();
  };

  const getFilteredImages = () => {
    const allImages = getAllImages();
    if (!imageSearchQuery) return allImages;
    return allImages.filter(img => 
      img.name.toLowerCase().includes(imageSearchQuery.toLowerCase())
    );
  };

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

  const handleAddBundle = () => {
    if (!newBundle.name || newBundle.products.length === 0 || newBundle.price <= 0) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi nama bundling, pilih produk, dan tentukan harga",
        variant: "destructive",
      });
      return;
    }

    const bundle: Bundle = {
      ...newBundle,
      id: Date.now().toString(),
      isAvailable: true
    };

    setBundles([...bundles, bundle]);
    setNewBundle({ name: '', products: [], price: 0, image: '' });
    setSelectedImage('');
    setShowAddBundleDialog(false);
    
    toast({
      title: "Bundling Ditambahkan",
      description: `${bundle.name} berhasil ditambahkan`,
    });
  };

  const handleEditBundle = () => {
    if (!editingBundle || !isOwner) return;

    const updatedBundle = { ...editingBundle, image: selectedImage || undefined };
    setBundles(bundles.map(b => 
      b.id === editingBundle.id ? updatedBundle : b
    ));
    
    setEditingBundle(null);
    setSelectedImage('');
    setShowEditBundleDialog(false);
    
    toast({
      title: "Bundling Diperbarui",
      description: "Data bundling berhasil diperbarui",
    });
  };

  const handleDeleteBundle = (bundleId: string) => {
    setBundles(bundles.filter(b => b.id !== bundleId));
    toast({
      title: "Bundling Dihapus",
      description: "Bundling berhasil dihapus",
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

  const startEditBundle = (bundle: Bundle) => {
    if (!isOwner) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya pemilik yang dapat mengedit bundling",
        variant: "destructive",
      });
      return;
    }
    setEditingBundle({ ...bundle });
    setSelectedImage(bundle.image || '');
    setShowEditBundleDialog(true);
  };

  const addProductToBundle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingProduct = newBundle.products.find(p => p.productId === productId);
    if (existingProduct) {
      setNewBundle({
        ...newBundle,
        products: newBundle.products.map(p =>
          p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      });
    } else {
      setNewBundle({
        ...newBundle,
        products: [...newBundle.products, { productId, productName: product.name, quantity: 1 }]
      });
    }
  };

  const removeProductFromBundle = (productId: string) => {
    setNewBundle({
      ...newBundle,
      products: newBundle.products.filter(p => p.productId !== productId)
    });
  };

  const updateBundleProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromBundle(productId);
      return;
    }
    
    setNewBundle({
      ...newBundle,
      products: newBundle.products.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    });
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="products">Produk Satuan</TabsTrigger>
              {isOwner && <TabsTrigger value="bundles">Bundling Produk</TabsTrigger>}
            </TabsList>

            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Produk Satuan</h2>
                {isOwner && (
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tambah Produk Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Image Selection Section */}
                        <div className="space-y-4">
                          <Label>Pilih Gambar Produk</Label>
                          
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
                                    <p className="text-sm font-medium">Gambar Dipilih</p>
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

                          {/* Upload Manual */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Upload Gambar dari Perangkat</h4>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-600 mb-2">Pilih file gambar dari perangkat Anda</p>
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
                              </div>
                            </CardContent>
                          </Card>

                          {/* Image Library */}
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Cari Gambar Produk</h4>
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="Cari gambar produk..."
                                    value={imageSearchQuery}
                                    onChange={(e) => setImageSearchQuery(e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                  {getFilteredImages().map((image, index) => (
                                    <Card 
                                      key={index}
                                      className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedImage === image.url ? 'ring-2 ring-primary' : ''
                                      }`}
                                      onClick={() => {
                                        setSelectedImage(image.url);
                                        setNewProduct({...newProduct, image: image.url});
                                      }}
                                    >
                                      <CardContent className="p-2">
                                        <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                          <img 
                                            src={image.url} 
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <p className="text-xs text-center mt-1 truncate">{image.name}</p>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* No Image Option */}
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
              </div>

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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {!isOwner && (
                            <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                              View Only
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

            {/* Bundles Tab - Only for Owner */}
            {isOwner && (
              <TabsContent value="bundles">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Bundling Produk</h2>
                  <Dialog open={showAddBundleDialog} onOpenChange={setShowAddBundleDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Bundling
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tambah Bundling Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="bundle-name">Nama Bundling</Label>
                          <Input
                            id="bundle-name"
                            value={newBundle.name}
                            onChange={(e) => setNewBundle({...newBundle, name: e.target.value})}
                            placeholder="Masukkan nama bundling"
                          />
                        </div>

                        <div>
                          <Label>Pilih Produk untuk Bundling</Label>
                          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                            {products.map(product => (
                              <Card key={product.id} className="p-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">Rp {product.price.toLocaleString('id-ID')}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addProductToBundle(product.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {newBundle.products.length > 0 && (
                          <div>
                            <Label>Produk dalam Bundling</Label>
                            <div className="space-y-2">
                              {newBundle.products.map(bundleProduct => (
                                <Card key={bundleProduct.productId} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{bundleProduct.productName}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateBundleProductQuantity(bundleProduct.productId, bundleProduct.quantity - 1)}
                                      >
                                        -
                                      </Button>
                                      <span className="text-sm font-medium w-8 text-center">{bundleProduct.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateBundleProductQuantity(bundleProduct.productId, bundleProduct.quantity + 1)}
                                      >
                                        +
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProductFromBundle(bundleProduct.productId)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="bundle-price">Harga Bundling</Label>
                          <Input
                            id="bundle-price"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {bundles.map((bundle) => (
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
                        <h3 className="font-medium mb-2 line-clamp-2">{bundle.name}</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Komposisi:</span>
                            <p className="text-sm">
                              {bundle.products.map(p => `${p.productName} (${p.quantity}x)`).join(', ')}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Harga:</span>
                            <span className="font-medium">Rp {bundle.price.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Status:</span>
                            <Badge variant={bundle.isAvailable ? 'secondary' : 'destructive'}>
                              {bundle.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {bundles.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Belum ada bundling yang dibuat</p>
                    <p className="text-sm text-muted-foreground">Klik "Tambah Bundling" untuk membuat paket produk pertama</p>
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
                  {/* Image selection for edit - similar to add product */}
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
                              onClick={() => setSelectedImage('')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                      {getAllImages().map((image, index) => (
                        <Card 
                          key={index}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedImage === image.url ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedImage(image.url)}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
