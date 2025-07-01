
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Receipt, Clock, Package, Users } from 'lucide-react';
import ProductCard from '@/components/transaction/ProductCard';
import ProductFilters from '@/components/transaction/ProductFilters';
import PaymentDialog from '@/components/transaction/PaymentDialog';
import ReceiptDialog from '@/components/transaction/ReceiptDialog';
import { useToast } from '@/hooks/use-toast';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'bundle';
  stock?: number;
}

const Transaction = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const { toast } = useToast();

  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Beras Premium 5kg',
      category: 'sembako',
      price: 75000,
      stock: 25,
      barcode: '8901234567890',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Minyak Goreng 1L',
      category: 'sembako',
      price: 18000,
      stock: 50,
      barcode: '8901234567891'
    },
    {
      id: '3',
      name: 'Gula Pasir 1kg',
      category: 'sembako',
      price: 14000,
      stock: 30,
      barcode: '8901234567892'
    },
    {
      id: '4',
      name: 'Indomie Goreng',
      category: 'makanan',
      price: 3500,
      stock: 100,
      barcode: '8901234567893'
    },
    {
      id: '5',
      name: 'Teh Botol Sosro',
      category: 'minuman',
      price: 4000,
      stock: 75,
      barcode: '8901234567894'
    }
  ];

  // Sample bundles
  const bundles: Bundle[] = [
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
  ];

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'sembako', label: 'Sembako' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'makanan', label: 'Makanan Instan' },
    { value: 'kebersihan', label: 'Kebersihan' },
    { value: 'bundling', label: 'Bundling' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredBundles = bundles.filter(bundle => {
    if (selectedCategory !== 'all' && selectedCategory !== 'bundling') return false;
    return bundle.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddToCart = (item: Product | Bundle) => {
    const isBundle = 'products' in item;
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      type: isBundle ? 'bundle' : 'product',
      stock: isBundle ? undefined : (item as Product).stock
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, cartItem];
    });

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${item.name} berhasil ditambahkan`,
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast({
      title: "Dihapus dari keranjang",
      description: "Item berhasil dihapus dari keranjang",
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua item berhasil dihapus",
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID'),
      items: [...cart],
      subtotal: getTotalPrice(),
      tax: Math.round(getTotalPrice() * 0.1),
      total: getTotalPrice() + Math.round(getTotalPrice() * 0.1),
      paymentMethod: paymentData.method || 'cash',
      amountPaid: paymentData.amountPaid || getTotalPrice(),
      change: Math.max(0, (paymentData.amountPaid || getTotalPrice()) - getTotalPrice()),
      cashierName: 'Kasir'
    };

    setLastTransaction(transaction);
    setCart([]);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);

    toast({
      title: "Pembayaran Berhasil",
      description: "Transaksi telah selesai",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kasir</h1>
              <p className="text-sm text-gray-600">Kelola transaksi penjualan</p>
            </div>
          </div>
          
          {/* Order Info - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Kasir 01</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Products */}
          <div className="flex-1 flex flex-col min-w-0 lg:pr-96">
            {/* Product Filters */}
            <div className="p-4 bg-white border-b">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>

            {/* Category Tabs */}
            <div className="p-4 bg-white border-b">
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
                
                {filteredBundles.map((bundle) => (
                  <ProductCard
                    key={bundle.id}
                    bundle={bundle}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && filteredBundles.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Tidak ada produk ditemukan</p>
                  <p className="text-gray-400 text-sm">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="fixed lg:absolute right-0 top-0 bottom-0 w-full lg:w-96 bg-white border-l shadow-lg z-20 lg:z-0 flex flex-col">
            {/* Order Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Pesanan Saat Ini</h2>
                <Badge variant="secondary" className="px-3 py-1">
                  Order #001
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{getTotalItems()} item</span>
                <span>Meja: Kasir</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">Belum ada pesanan</p>
                  <p className="text-gray-400 text-sm">Pilih produk untuk memulai</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                            {item.type === 'bundle' && (
                              <Badge variant="outline" size="sm" className="mt-1">
                                Bundle
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-gray-50 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                              disabled={item.type === 'product' && item.stock !== undefined && item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold text-gray-900">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="border-t bg-white p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span className="font-medium">Rp {Math.round(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">Rp {(getTotalPrice() + Math.round(getTotalPrice() * 0.1)).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Bayar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={getTotalPrice()}
        onPaymentComplete={handlePaymentSuccess}
      />

      <ReceiptDialog
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={lastTransaction}
      />
    </div>
  );
};

export default Transaction;
