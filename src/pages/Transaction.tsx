import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Receipt } from 'lucide-react';
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
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    <div className="flex h-screen">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 md:p-6 border-b bg-white">
          <div className="flex items-center space-x-2 md:space-x-4">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-bold">Transaksi Penjualan</h1>
          </div>
          <Badge variant="secondary" className="hidden md:flex">
            {getTotalItems()} item di keranjang
          </Badge>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Products Section */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-3 md:p-6 border-b bg-white">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>

            <div className="flex-1 p-3 md:p-6 bg-gray-50 overflow-auto pb-20 lg:pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {/* Regular Products */}
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
                
                {/* Bundles */}
                {filteredBundles.map((bundle) => (
                  <ProductCard
                    key={bundle.id}
                    bundle={bundle}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && filteredBundles.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Cart Section */}
          <div className="hidden lg:block w-80 xl:w-96 bg-white border-l flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Keranjang
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600"
                  disabled={cart.length === 0}
                >
                  Kosongkan
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Keranjang kosong</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 border rounded-lg bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Rp {item.price.toLocaleString('id-ID')}
                          {item.type === 'bundle' && <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">Bundle</Badge>}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0 rounded-full"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0 rounded-full"
                          disabled={item.type === 'product' && item.stock !== undefined && item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-7 w-7 p-0 text-red-600 ml-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-3 bg-white">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} item)</span>
                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full"
                  size="sm"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Bayar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cart Button - Fixed at bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          {cart.length === 0 ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">Keranjang kosong</span>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="w-full relative border-blue-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      Keranjang
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    Rp {getTotalPrice().toLocaleString('id-ID')}
                  </span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Cart Modal */}
        {isCartOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsCartOpen(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Keranjang ({getTotalItems()} item)
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600"
                >
                  Kosongkan
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto p-3 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Rp {item.price.toLocaleString('id-ID')}
                        {item.type === 'bundle' && <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">Bundle</Badge>}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 rounded-full"
                        disabled={item.type === 'product' && item.stock !== undefined && item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-600 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4 bg-white">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} item)</span>
                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1"
                  >
                    Lanjut Belanja
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsPaymentOpen(true);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Bayar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
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
