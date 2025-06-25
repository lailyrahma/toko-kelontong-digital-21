import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import WhatsAppStockAlert from '@/components/notifications/WhatsAppStockAlert';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

const Dashboard = () => {
  const products: Product[] = [
    { id: '1', name: 'Beras Premium 5kg', category: 'Sembako', price: 75000, stock: 20, barcode: '1234567890123', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop' },
    { id: '2', name: 'Minyak Goreng 1L', category: 'Sembako', price: 18000, stock: 5, barcode: '1234567890124', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop' },
    { id: '3', name: 'Gula Pasir 1kg', category: 'Sembako', price: 14000, stock: 0, barcode: '1234567890125' },
    { id: '4', name: 'Indomie Goreng', category: 'Makanan Instan', price: 3500, stock: 100, barcode: '1234567890126', image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop' },
    { id: '5', name: 'Teh Botol Sosro', category: 'Minuman', price: 4000, stock: 8, barcode: '1234567890127', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop' },
    { id: '6', name: 'Sabun Mandi Lifebuoy', category: 'Kebersihan', price: 8500, stock: 30, barcode: '1234567890128' },
  ];

  const totalProducts = products.length;
  const totalCategories = [...new Set(products.map(p => p.category))].length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const lowStockProducts = products.filter(p => p.stock <= 10);

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div>
            {/* Add any header actions here */}
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Selamat Datang!</h2>
            <p className="text-gray-700">
              Ringkasan informasi toko Anda.
            </p>
          </section>

          {/* Stock Alerts Section - Add WhatsApp button */}
          {lowStockProducts.length > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    <CardTitle className="text-orange-800">Peringatan Stok</CardTitle>
                  </div>
                  <WhatsAppStockAlert lowStockProducts={lowStockProducts} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-3">
                  {lowStockProducts.length} produk memiliki stok menipis atau habis:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                        {product.stock === 0 ? 'Habis' : `${product.stock} unit`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProducts}</div>
                <p className="text-gray-500">Jumlah keseluruhan produk.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCategories}</div>
                <p className="text-gray-500">Jumlah kategori produk.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Stok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalStock}</div>
                <p className="text-gray-500">Jumlah stok keseluruhan.</p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
