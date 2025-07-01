
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Search, CreditCard, Smartphone, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
}

const Transaction = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const { toast } = useToast();

  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Beras Premium 5kg',
      category: 'sembako',
      price: 75000,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Minyak Goreng 1L',
      category: 'sembako',
      price: 18000,
      stock: 50,
    },
    {
      id: '3',
      name: 'Gula Pasir 1kg',
      category: 'sembako',
      price: 14000,
      stock: 30,
    },
    {
      id: '4',
      name: 'Indomie Goreng',
      category: 'makanan',
      price: 3500,
      stock: 100,
    },
    {
      id: '5',
      name: 'Teh Botol Sosro',
      category: 'minuman',
      price: 4000,
      stock: 75,
    },
    {
      id: '6',
      name: 'Roti Tawar',
      category: 'makanan',
      price: 8500,
      stock: 20,
    },
    {
      id: '7',
      name: 'Susu Ultra 1L',
      category: 'minuman',
      price: 16000,
      stock: 40,
    },
    {
      id: '8',
      name: 'Telur Ayam 1kg',
      category: 'sembako',
      price: 28000,
      stock: 15,
    }
  ];

  const categories = [
    { value: 'all', label: 'All Menu', count: products.length },
    { value: 'sembako', label: 'Sembako', count: products.filter(p => p.category === 'sembako').length },
    { value: 'makanan', label: 'Makanan', count: products.filter(p => p.category === 'makanan').length },
    { value: 'minuman', label: 'Minuman', count: products.filter(p => p.category === 'minuman').length },
  ];

  const orderStatuses = [
    { value: 'all', label: 'All', count: 24, color: 'bg-blue-500' },
    { value: 'dine_in', label: 'Dine In', count: 16, color: 'bg-green-500' },
    { value: 'wait_list', label: 'Wait List', count: 8, color: 'bg-orange-500' },
    { value: 'take_away', label: 'Take Away', count: 12, color: 'bg-purple-500' },
    { value: 'served', label: 'Served', count: 6, color: 'bg-teal-500' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Stok tidak mencukupi",
            description: `Maksimal ${product.stock} item`,
            variant: "destructive"
          });
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        stock: product.stock 
      }];
    });

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${product.name} berhasil ditambahkan`,
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const product = products.find(p => p.id === id);
    if (product && newQuantity > product.stock) {
      toast({
        title: "Stok tidak mencukupi",
        description: `Maksimal ${product.stock} item`,
        variant: "destructive"
      });
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
  };

  const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTax = () => Math.round(getSubtotal() * 0.1);
  const getTotal = () => getSubtotal() + getTax();
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tambahkan produk terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pesanan berhasil",
      description: "Pesanan Anda telah diterima",
    });
    setCart([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order Line</h1>
              <p className="text-sm text-gray-600">Kelola pesanan penjualan</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search menu, orders and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Table No #04</p>
              <p className="text-xs text-gray-500">Order #F0030 • 2 People</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar - Order Status */}
          <div className="w-64 bg-white border-r p-4 hidden lg:block">
            <div className="space-y-2">
              {orderStatuses.map((status) => (
                <Button
                  key={status.value}
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <Badge variant="secondary">{status.count}</Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Search */}
            <div className="p-4 bg-white border-b md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Menu */}
            <div className="p-4 bg-white border-b">
              <h2 className="text-lg font-semibold mb-4">Foodies Menu</h2>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap flex-shrink-0"
                  >
                    {category.label}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const cartItem = cart.find(item => item.id === product.id);
                                if (cartItem && cartItem.quantity > 0) {
                                  updateQuantity(product.id, cartItem.quantity - 1);
                                }
                              }}
                              disabled={!cart.find(item => item.id === product.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium min-w-[1rem] text-center">
                              {cart.find(item => item.id === product.id)?.quantity || 0}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Stok: {product.stock}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="w-80 bg-white border-l flex flex-col">
            {/* Order Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Ordered Items</h3>
                <Badge variant="outline">{getTotalItems().toString().padStart(2, '0')}</Badge>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Belum ada pesanan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="ml-2 min-w-[4rem] text-right">
                        <span className="font-semibold text-sm">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Summary */}
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rp {getSubtotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Rp {getTax().toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Payable</span>
                    <span>Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Payment Method</p>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedPayment === 'cash' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPayment('cash')}
                      className="flex-1"
                    >
                      Cash
                    </Button>
                    <Button
                      variant={selectedPayment === 'card' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPayment('card')}
                      className="flex-1"
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      Card
                    </Button>
                    <Button
                      variant={selectedPayment === 'qris' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPayment('qris')}
                      className="flex-1"
                    >
                      <Scan className="h-3 w-3 mr-1" />
                      Scan
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  Place Order
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
