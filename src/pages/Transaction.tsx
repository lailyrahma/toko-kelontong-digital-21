import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, ShoppingCart, User, Package, Calendar, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/transaction/ProductCard';
import CartItem from '@/components/transaction/CartItem';
import PaymentDialog from '@/components/transaction/PaymentDialog';
import ReceiptDialog from '@/components/transaction/ReceiptDialog';
import ProductFilters from '@/components/transaction/ProductFilters';

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
  isBundle?: boolean;
  maxQuantity?: number;
}

interface Customer {
  name: string;
  phone: string;
}

interface Receipt {
  id: string;
  date: string;
  time: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  cashierName: string;
}

const Transaction = () => {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Beras Premium 5kg', category: 'Sembako', price: 75000, stock: 20, barcode: '1234567890123', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop' },
    { id: '2', name: 'Minyak Goreng 1L', category: 'Sembako', price: 18000, stock: 5, barcode: '1234567890124', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop' },
    { id: '3', name: 'Gula Pasir 1kg', category: 'Sembako', price: 14000, stock: 0, barcode: '1234567890125' },
    { id: '4', name: 'Indomie Goreng', category: 'Makanan Instan', price: 3500, stock: 100, barcode: '1234567890126', image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop' },
    { id: '5', name: 'Teh Botol Sosro', category: 'Minuman', price: 4000, stock: 8, barcode: '1234567890127', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop' },
    { id: '6', name: 'Sabun Mandi Lifebuoy', category: 'Kebersihan', price: 8500, stock: 30, barcode: '1234567890128' },
  ]);

  const [bundles] = useState<Bundle[]>([
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

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' });

  const { toast } = useToast();

  const categories = ['Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan', 'Snack', 'Frozen Food', 'Bundling'];

  // Combine products and bundles for display
  const allItems = [
    ...products.map(p => ({ type: 'product' as const, item: p })),
    ...bundles.map(b => ({ type: 'bundle' as const, item: b }))
  ];

  const filteredItems = allItems.filter(({ type, item }) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      if (type === 'product') {
        matchesCategory = (item as Product).category === selectedCategory;
      } else {
        // For bundles, we can match based on the categories of included products
        const bundle = item as Bundle;
        const bundleCategories = bundle.products.map(p => {
          const product = products.find(prod => prod.id === p.productId);
          return product?.category;
        });
        matchesCategory = bundleCategories.includes(selectedCategory);
      }
    }

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: Product | Bundle) => {
    const isBundle = 'products' in item;
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const maxQuantity = isBundle ? 10 : (item as Product).stock;
      if (existingItem.quantity < maxQuantity) {
        setCart(cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
        toast({
          title: "Produk Ditambahkan",
          description: `${item.name} ditambahkan ke keranjang`,
        });
      } else {
        toast({
          title: "Stok Tidak Cukup",
          description: isBundle ? "Jumlah maksimal bundling tercapai" : "Stok tidak mencukupi",
          variant: "destructive",
        });
      }
    } else {
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        isBundle,
        maxQuantity: isBundle ? 10 : (item as Product).stock
      };
      
      setCart([...cart, newCartItem]);
      toast({
        title: "Produk Ditambahkan",
        description: `${item.name} ditambahkan ke keranjang`,
      });
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (id: string) => {
    const item = cart.find(cartItem => cartItem.id === id);
    setCart(cart.filter(cartItem => cartItem.id !== id));
    
    if (item) {
      toast({
        title: "Produk Dihapus",
        description: `${item.name} dihapus dari keranjang`,
      });
    }
  };

  const handleClearCart = () => {
    setCart([]);
    toast({
      title: "Keranjang Dikosongkan",
      description: "Semua produk telah dihapus dari keranjang",
    });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = (paymentMethod: string, amountPaid: number) => {
    const { subtotal, tax, total } = calculateTotal();
    const change = amountPaid - total;
    
    const newReceipt: Receipt = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID'),
      items: [...cart],
      customer: customer.name ? customer : undefined,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountPaid,
      change,
      cashierName: 'Kasir Demo'
    };
    
    setReceipt(newReceipt);
    setCart([]);
    setCustomer({ name: '', phone: '' });
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    
    toast({
      title: "Transaksi Berhasil",
      description: `Total: Rp ${total.toLocaleString('id-ID')}`,
    });
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen">
        <header className="flex items-center space-x-4 p-4 lg:p-6 border-b bg-white flex-shrink-0">
          <SidebarTrigger />
          <h1 className="text-xl lg:text-2xl font-bold">Transaksi Penjualan</h1>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Products Section */}
          <div className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-y-auto">
            {/* Search and Filters */}
            <div className="mb-4 lg:mb-6 space-y-3 lg:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk atau bundling..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 lg:h-12"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 lg:h-12">
                  <SelectValue placeholder="Pilih kategori" />
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
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {filteredItems.map(({ type, item }) => (
                <ProductCard
                  key={item.id}
                  product={type === 'product' ? item as Product : undefined}
                  bundle={type === 'bundle' ? item as Bundle : undefined}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Tidak ada produk yang ditemukan</p>
              </div>
            )}
          </div>

          {/* Cart Section - Fixed height with better layout */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-white flex flex-col max-h-[50vh] lg:max-h-none">
            <div className="p-3 lg:p-4 border-b flex-shrink-0">
              <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                <h2 className="text-base lg:text-lg font-semibold">Keranjang</h2>
                <Badge variant="secondary" className="text-xs">{cart.length}</Badge>
              </div>
              
              {/* Customer Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Nama pelanggan (opsional)"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    className="text-xs lg:text-sm h-8 lg:h-10"
                  />
                </div>
                <Input
                  placeholder="No. telepon (opsional)"
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="text-xs lg:text-sm h-8 lg:h-10"
                />
              </div>
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 lg:p-4 min-h-0">
              {cart.length === 0 ? (
                <div className="text-center py-6 lg:py-8 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm lg:text-base">Keranjang kosong</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary - Fixed at bottom */}
            {cart.length > 0 && (
              <div className="border-t p-3 lg:p-4 space-y-3 lg:space-y-4 flex-shrink-0 bg-white">
                <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (10%):</span>
                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-sm lg:text-base">
                    <span>Total:</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    size="sm"
                    className="h-8 lg:h-10 text-xs lg:text-sm"
                  >
                    Kosongkan
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    size="sm"
                    className="h-8 lg:h-10 text-xs lg:text-sm"
                  >
                    <CreditCard className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                    Bayar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />

      <ReceiptDialog
        isOpen={showReceiptDialog}
        onClose={() => setShowReceiptDialog(false)}
        receipt={receipt}
      />
    </>
  );
};

export default Transaction;
