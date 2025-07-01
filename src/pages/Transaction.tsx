
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Receipt } from 'lucide-react';
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
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const { toast } = useToast();

  // Sample food products matching the image
  const products: Product[] = [
    {
      id: '1',
      name: 'Grilled Salmon Steak',
      category: 'lunch',
      price: 15.00,
      stock: 25,
      barcode: '8901234567890',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Tofu Poke Bowl',
      category: 'salad',
      price: 7.00,
      stock: 30,
      barcode: '8901234567891',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Pasta with Roast Beef',
      category: 'pasta',
      price: 10.00,
      stock: 20,
      barcode: '8901234567892',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc92d2ee4?w=200&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Beef Steak',
      category: 'beef',
      price: 30.00,
      stock: 15,
      barcode: '8901234567893',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop'
    },
    {
      id: '5',
      name: 'Shrimp Rice Bowl',
      category: 'rice',
      price: 8.00,
      stock: 25,
      barcode: '8901234567894',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=200&h=200&fit=crop'
    },
    {
      id: '6',
      name: 'Apple Stuffed Pancake',
      category: 'dessert',
      price: 35.00,
      stock: 10,
      barcode: '8901234567895',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'
    },
    {
      id: '7',
      name: 'Chicken Quinoa & Herbs',
      category: 'chicken',
      price: 12.00,
      stock: 18,
      barcode: '8901234567896',
      image: 'https://images.unsplash.com/photo-1598515213692-d1b01ea04c17?w=200&h=200&fit=crop'
    },
    {
      id: '8',
      name: 'Vegetable Shrimp',
      category: 'salad',
      price: 10.00,
      stock: 22,
      barcode: '8901234567897',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop'
    }
  ];

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'salad', label: 'Salad' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'beef', label: 'Beef' },
    { value: 'rice', label: 'Rice' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'chicken', label: 'Chicken' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items removed from cart",
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
      cashierName: 'Cashier'
    };

    setLastTransaction(transaction);
    setCart([]);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);

    toast({
      title: "Payment Successful",
      description: "Transaction completed successfully",
    });
  };

  return (
    <div className="flex h-screen">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Transaction</h1>
          </div>
          <Badge variant="secondary">
            {getTotalItems()} items in cart
          </Badge>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Products Section */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-4 border-b bg-white">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>

            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const quantity = getCartItemQuantity(product.id);
                  
                  return (
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
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 capitalize">{product.category}</div>
                          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                            
                            {quantity === 0 ? (
                              <Button
                                onClick={() => addToCart(product)}
                                className="w-8 h-8 rounded-full p-0 bg-teal-500 hover:bg-teal-600"
                                disabled={product.stock === 0}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-8 h-8 rounded-full p-0 bg-teal-500 hover:bg-teal-600"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                                <Button
                                  onClick={() => addToCart(product)}
                                  className="w-8 h-8 rounded-full p-0 bg-teal-500 hover:bg-teal-600"
                                  disabled={quantity >= product.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-80 xl:w-96 bg-white border-l flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart
                </h2>
                {cart.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-7 w-7 p-0 rounded-full"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const product = products.find(p => p.id === item.id);
                            if (product) addToCart(product);
                          }}
                          className="h-7 w-7 p-0 rounded-full"
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
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
              <div className="border-t p-4 bg-white">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </Button>
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
