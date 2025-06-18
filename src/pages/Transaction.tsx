import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Scan, ShoppingCart, Trash2, X, Calculator, Receipt, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/transaction/ProductCard';
import CartItem from '@/components/transaction/CartItem';
import ProductFilters from '@/components/transaction/ProductFilters';
import PaymentDialog from '@/components/transaction/PaymentDialog';
import ReceiptDialog from '@/components/transaction/ReceiptDialog';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface CartItemData extends Product {
  quantity: number;
}

const Transaction = () => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'debit'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showMobilePayment, setShowMobilePayment] = useState(false);
  const [showMobileReceipt, setShowMobileReceipt] = useState(false);
  const { toast } = useToast();

  // Sample products with images
  const [products] = useState<Product[]>([
    { 
      id: '1', 
      name: 'Beras Premium 5kg', 
      category: 'Sembako', 
      price: 75000, 
      stock: 20, 
      barcode: '1234567890123',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop'
    },
    { 
      id: '2', 
      name: 'Minyak Goreng 1L', 
      category: 'Sembako', 
      price: 18000, 
      stock: 15, 
      barcode: '1234567890124',
      image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop'
    },
    { 
      id: '3', 
      name: 'Gula Pasir 1kg', 
      category: 'Sembako', 
      price: 14000, 
      stock: 0, 
      barcode: '1234567890125'
    },
    { 
      id: '4', 
      name: 'Indomie Goreng', 
      category: 'Makanan Instan', 
      price: 3500, 
      stock: 100, 
      barcode: '1234567890126',
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop'
    },
    { 
      id: '5', 
      name: 'Teh Botol Sosro', 
      category: 'Minuman', 
      price: 4000, 
      stock: 50, 
      barcode: '1234567890127',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop'
    },
    { 
      id: '6', 
      name: 'Sabun Mandi Lifebuoy', 
      category: 'Kebersihan', 
      price: 8500, 
      stock: 30, 
      barcode: '1234567890128'
    },
  ]);

  const categories = ['all', 'Sembako', 'Makanan Instan', 'Minuman', 'Kebersihan'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: "Stok Habis",
        description: `${product.name} tidak tersedia`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stok Tidak Cukup",
          description: `Stok ${product.name} hanya ${product.stock}`,
          variant: "destructive",
        });
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };

  const handleMobilePayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    setShowMobileCart(false);
    setShowMobilePayment(true);
  };

  const processPayment = () => {
    const paid = parseFloat(amountPaid) || 0;
    
    if (paymentMethod === 'cash' && paid < totalAmount) {
      toast({
        title: "Pembayaran Kurang",
        description: "Jumlah yang dibayar kurang dari total",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(false);
    setShowMobilePayment(false);
    setShowReceipt(true);
    setShowMobileReceipt(true);
    
    toast({
      title: "Transaksi Berhasil",
      description: "Pembayaran telah diproses",
    });
  };

  const cancelPayment = () => {
    setShowPayment(false);
    setShowMobilePayment(false);
    setAmountPaid('');
    toast({
      title: "Pembayaran Dibatalkan",
      description: "Transaksi telah dibatalkan",
      variant: "destructive",
    });
  };

  const finishTransaction = () => {
    setShowReceipt(false);
    setShowMobileReceipt(false);
    clearCart();
    setAmountPaid('');
    toast({
      title: "Transaksi Selesai",
      description: "Siap untuk transaksi baru",
    });
  };

  const changeAmount = paymentMethod === 'cash' && amountPaid ? 
    parseFloat(amountPaid) - totalAmount : 0;

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-bold truncate">Transaksi</h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Button variant="outline" className="scan-animation hidden sm:flex" size="sm">
              <Scan className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
            <Button variant="outline" className="scan-animation sm:hidden" size="sm">
              <Scan className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Desktop Layout with Resizable Panels */}
          <div className="hidden lg:flex flex-1">
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              {/* Product Selection Panel */}
              <ResizablePanel defaultSize={65} minSize={50}>
                <div className="h-full p-6">
                  <ProductFilters
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setSelectedCategory}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Desktop Cart Panel - Simplified */}
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                <div className="h-full bg-white border-l">
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold flex items-center text-blue-900">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Keranjang ({totalItems})
                      </h2>
                      {cartItems.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-500">Keranjang kosong</p>
                          <p className="text-sm text-gray-400">Tambahkan produk untuk memulai</p>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                          />
                        ))
                      )}
                    </div>

                    <Separator className="my-4" />
                    
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex justify-between text-lg font-bold text-blue-900">
                        <span>Total:</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handlePayment} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" 
                      size="lg"
                      disabled={cartItems.length === 0}
                    >
                      Bayar Sekarang
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Mobile Product Selection */}
          <div className="lg:hidden flex-1 p-4 md:p-6 pb-24">
            <ProductFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              categories={categories}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Mobile Cart Button - Simplified and More Prominent */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
            <Button 
              onClick={() => setShowMobileCart(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg relative shadow-lg"
              size="lg"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Lihat Keranjang ({totalItems})
              {totalItems > 0 && (
                <>
                  <span className="ml-auto">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Cart Overlay - Simplified */}
        {showMobileCart && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b bg-blue-50">
                <h2 className="text-lg font-semibold flex items-center text-blue-900">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Keranjang ({totalItems})
                </h2>
                <div className="flex items-center space-x-2">
                  {cartItems.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowMobileCart(false)}
                    className="text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col h-full">
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 font-medium">Keranjang kosong</p>
                      <p className="text-sm text-gray-400">Tambahkan produk untuk memulai</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t p-4 bg-white">
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex justify-between text-xl font-bold text-blue-900">
                        <span>Total:</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleMobilePayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg shadow-lg" 
                      size="lg"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Lanjut Pembayaran
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Payment Overlay */}
        {showMobilePayment && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-blue-900">
                    <Calculator className="inline mr-2 h-5 w-5" />
                    Pembayaran
                  </h2>
                  <Button variant="ghost" size="sm" onClick={cancelPayment} className="text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-center bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Belanja</p>
                  <p className="text-2xl font-bold text-blue-900">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('cash')}
                      className="flex flex-col h-16"
                    >
                      <DollarSign className="h-5 w-5 mb-1" />
                      Tunai
                    </Button>
                    <Button
                      variant={paymentMethod === 'qris' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('qris')}
                      className="flex flex-col h-16"
                    >
                      <Receipt className="h-5 w-5 mb-1" />
                      QRIS
                    </Button>
                    <Button
                      variant={paymentMethod === 'debit' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('debit')}
                      className="flex flex-col h-16"
                    >
                      <CreditCard className="h-5 w-5 mb-1" />
                      Debit
                    </Button>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Jumlah Dibayar</label>
                    <input
                      type="number"
                      placeholder="Masukkan jumlah"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                    />
                    {amountPaid && parseFloat(amountPaid) >= totalAmount && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-800">
                          Kembalian: Rp {changeAmount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                    {amountPaid && parseFloat(amountPaid) < totalAmount && (
                      <p className="text-sm text-red-600 mt-2">
                        Jumlah kurang Rp {(totalAmount - parseFloat(amountPaid)).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button onClick={cancelPayment} variant="outline" className="flex-1">
                    Batal
                  </Button>
                  <Button 
                    onClick={processPayment} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < totalAmount)}
                  >
                    Proses Bayar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Receipt Overlay */}
        {showMobileReceipt && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b bg-green-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-green-900">
                    <Receipt className="inline mr-2 h-5 w-5" />
                    Struk Belanja
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-lg">Toko Kelontong Barokah</h3>
                  <p className="text-sm text-gray-600">Jl. Mawar No. 123, Jakarta</p>
                  <p className="text-sm text-gray-600">Telp: 021-12345678</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date().toLocaleString('id-ID')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-xs text-gray-500">
                          {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <span className="font-medium">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Metode:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                  {paymentMethod === 'cash' && amountPaid && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Dibayar:</span>
                        <span>Rp {parseFloat(amountPaid).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-green-600">
                        <span>Kembalian:</span>
                        <span>Rp {changeAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Receipt className="mr-2 h-4 w-4" />
                    Cetak
                  </Button>
                  <Button onClick={finishTransaction} className="flex-1 bg-green-600 hover:bg-green-700">
                    Selesai
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">Terima kasih atas kunjungan Anda!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <PaymentDialog
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          amountPaid={amountPaid}
          onPaymentMethodChange={setPaymentMethod}
          onAmountPaidChange={setAmountPaid}
          onProcessPayment={processPayment}
        />

        <ReceiptDialog
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          cartItems={cartItems}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          amountPaid={amountPaid}
          onFinishTransaction={finishTransaction}
        />
      </div>
    </>
  );
};

export default Transaction;
