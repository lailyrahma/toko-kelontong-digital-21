import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Plus, Package, X, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import ProductCard from '@/components/transaction/ProductCard';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
  isBundle?: boolean;
  bundleProducts?: { productName: string; quantity: number }[];
}

interface CartItemType extends Product {
  quantity: number;
}

const Transaction = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Beras Premium 5kg', category: 'Sembako', price: 75000, stock: 20, barcode: '1234567890123', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop' },
    { id: '2', name: 'Minyak Goreng 1L', category: 'Sembako', price: 18000, stock: 5, barcode: '1234567890124', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop' },
    { id: '3', name: 'Gula Pasir 1kg', category: 'Sembako', price: 14000, stock: 0, barcode: '1234567890125' },
    { id: '4', name: 'Indomie Goreng', category: 'Makanan Instan', price: 3500, stock: 100, barcode: '1234567890126', image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop' },
    { id: '5', name: 'Teh Botol Sosro', category: 'Minuman', price: 4000, stock: 8, barcode: '1234567890127', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop' },
    { id: '6', name: 'Sabun Mandi Lifebuoy', category: 'Kebersihan', price: 8500, stock: 30, barcode: '1234567890128' },
  ]);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate total whenever cart changes
    const newTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountedTotal = newTotal - (newTotal * (discount / 100));
    setTotal(discountedTotal);
    setChange(payment - discountedTotal);
  }, [cart, discount, payment]);

  // Add bundle products to the products list
  const bundleProducts = [
    {
      id: 'bundle-1',
      name: 'Paket Hemat Sembako',
      category: 'Bundle',
      price: 99000,
      stock: 1, // Available if all bundle products are in stock
      barcode: 'BDL001',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
      isBundle: true,
      bundleProducts: [
        { productName: 'Beras Premium 5kg', quantity: 1 },
        { productName: 'Minyak Goreng 1L', quantity: 2 },
        { productName: 'Gula Pasir 1kg', quantity: 1 }
      ]
    },
    {
      id: 'bundle-2', 
      name: 'Paket Minuman Segar',
      category: 'Bundle',
      price: 10000,
      stock: 1,
      barcode: 'BDL002',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop',
      isBundle: true,
      bundleProducts: [
        { productName: 'Teh Botol Sosro', quantity: 3 }
      ]
    }
  ];

  // Combine regular products with bundle products
  const allProducts = [...products, ...bundleProducts];

  // Update filtered products to include bundles
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || 
                           product.category === filterCategory ||
                           (product.isBundle && filterCategory === 'Bundle');
    return matchesSearch && matchesCategory;
  });

  const categories = ['Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan', 'Bundle'];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} berhasil ditambahkan ke keranjang`,
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    toast({
      title: "Produk Dihapus",
      description: "Produk berhasil dihapus dari keranjang",
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPayment(0);
    setChange(0);
    toast({
      title: "Keranjang Dikosongkan",
      description: "Semua produk telah dihapus dari keranjang",
    });
  };

  const handlePaymentChange = (value: number) => {
    setPayment(value);
    setChange(value - total);
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Products */}
        <div className="w-full lg:w-3/4 p-6 bg-gray-50">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">Transaksi</h1>
            </div>
          </header>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pilih Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari produk..."
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
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-full lg:w-80 xl:w-96 bg-white border-l flex flex-col">
          {/* Cart Header */}
          <CardHeader className="border-b">
            <CardTitle>Keranjang</CardTitle>
          </CardHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateCartItemQuantity}
                onRemove={removeFromCart}
              />
            ))}
            {cart.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Keranjang masih kosong</p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t">
            <div className="mb-3 flex items-center justify-between">
              <Label htmlFor="discount">Diskon (%)</Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-24 text-right"
              />
            </div>
            <div className="mb-3 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full mb-3">
                <SelectValue placeholder="Metode Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Kredit</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
            <div className="mb-3 flex items-center justify-between">
              <Label htmlFor="payment">Pembayaran</Label>
              <Input
                id="payment"
                type="number"
                placeholder="0"
                value={payment}
                onChange={(e) => handlePaymentChange(Number(e.target.value))}
                className="w-32 text-right"
              />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span>Kembalian</span>
              <span>Rp {change.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="w-1/2" onClick={clearCart}>
                Batal
              </Button>
              <Button className="w-1/2">Bayar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Card>
      <CardContent className="p-3 flex items-center space-x-4">
        <div className="aspect-square bg-gray-100 rounded-md w-12 h-12 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium line-clamp-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            className="w-16 text-center"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Transaction;
