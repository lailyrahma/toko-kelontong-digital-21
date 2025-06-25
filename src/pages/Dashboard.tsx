
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import TransactionHistoryWithFilters from '@/components/transaction/TransactionHistoryWithFilters';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Dashboard = () => {
  const { user, store } = useUser();
  const navigate = useNavigate();
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showSalesDetail, setShowSalesDetail] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showProfitDetail, setShowProfitDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'stock_alert' as const,
      title: 'Stok Gula Pasir Habis',
      message: 'Gula Pasir 1kg sudah habis. Segera lakukan restock untuk menghindari kehilangan penjualan.',
      time: '5 menit lalu',
      read: false,
      priority: 'high' as const,
      actionable: true
    },
    {
      id: '2',
      type: 'stock_alert' as const,
      title: 'Stok Minyak Goreng Menipis',
      message: 'Minyak Goreng 1L tersisa 5 unit. Pertimbangkan untuk menambah stok.',
      time: '1 jam lalu',
      read: false,
      priority: 'medium' as const,
      actionable: true
    },
    {
      id: '3',
      type: 'transaction' as const,
      title: 'Transaksi Berhasil',
      message: 'Transaksi TRX001 sebesar Rp 125.000 telah berhasil diproses.',
      time: '2 jam lalu',
      read: true,
      priority: 'low' as const,
      actionable: false
    }
  ]);

  // Sample transaction data with detailed items
  const sampleTransactions = [
    {
      id: 'TRX001',
      date: '2025-06-16',
      time: '14:30',
      items: [
        { id: '1', productName: 'Beras Premium 5kg', quantity: 1, price: 75000, subtotal: 75000 },
        { id: '2', productName: 'Minyak Goreng 1L', quantity: 2, price: 18000, subtotal: 36000 },
        { id: '3', productName: 'Indomie Goreng', quantity: 4, price: 3500, subtotal: 14000 }
      ],
      total: 125000,
      paymentMethod: 'cash' as const,
      status: 'completed' as const
    },
    {
      id: 'TRX002',
      date: '2025-06-16',
      time: '14:15',
      items: [
        { id: '4', productName: 'Gula Pasir 1kg', quantity: 2, price: 14000, subtotal: 28000 },
        { id: '5', productName: 'Teh Botol Sosro', quantity: 3, price: 4000, subtotal: 12000 },
        { id: '6', productName: 'Sabun Mandi Lifebuoy', quantity: 3, price: 8500, subtotal: 25500 }
      ],
      total: 65500,
      paymentMethod: 'qris' as const,
      status: 'completed' as const
    },
    {
      id: 'TRX003',
      date: '2025-06-16',
      time: '14:00',
      items: [
        { id: '1', productName: 'Beras Premium 5kg', quantity: 2, price: 75000, subtotal: 150000 },
        { id: '2', productName: 'Minyak Goreng 1L', quantity: 1, price: 18000, subtotal: 18000 },
        { id: '7', productName: 'Deterjen Rinso', quantity: 1, price: 12000, subtotal: 12000 },
        { id: '8', productName: 'Kopi Kapal Api', quantity: 2, price: 15000, subtotal: 30000 }
      ],
      total: 210000,
      paymentMethod: 'debit' as const,
      status: 'completed' as const
    },
    {
      id: 'TRX004',
      date: '2025-06-16',
      time: '13:45',
      items: [
        { id: '3', productName: 'Indomie Goreng', quantity: 6, price: 3500, subtotal: 21000 },
        { id: '5', productName: 'Teh Botol Sosro', quantity: 6, price: 4000, subtotal: 24000 }
      ],
      total: 45000,
      paymentMethod: 'cash' as const,
      status: 'completed' as const
    },
  ];

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    {
      title: 'Penjualan Hari Ini',
      value: 'Rp 2.450.000',
      description: '23 transaksi',
      icon: ShoppingCart,
      trend: '+12%',
      onClick: () => setShowSalesDetail(true)
    },
    {
      title: 'Total Produk',
      value: '1.234',
      description: '45 kategori',
      icon: Package,
      trend: '+3%',
      onClick: () => setShowProductDetail(true)
    },
    {
      title: 'Stok Menipis',
      value: '8',
      description: 'Perlu restock',
      icon: AlertTriangle,
      trend: 'warning',
      onClick: () => navigate('/stock')
    },
    {
      title: 'Profit Bulan Ini',
      value: 'Rp 45.2 Juta',
      description: 'Target 85%',
      icon: TrendingUp,
      trend: '+8%',
      onClick: () => setShowProfitDetail(true)
    }
  ];

  const recentTransactions = sampleTransactions.slice(0, 4).map(transaction => ({
    id: transaction.id,
    time: transaction.time,
    items: transaction.items.length,
    total: `Rp ${transaction.total.toLocaleString('id-ID')}`,
    method: transaction.paymentMethod === 'cash' ? 'Tunai' : 
             transaction.paymentMethod === 'qris' ? 'QRIS' : 'Debit',
    fullTransaction: transaction
  }));

  const lowStockItems = [
    { name: 'Beras Premium 5kg', stock: 8, category: 'Sembako', status: 'low' },
    { name: 'Minyak Goreng 1L', stock: 5, category: 'Sembako', status: 'low' },
    { name: 'Gula Pasir 1kg', stock: 0, category: 'Sembako', status: 'empty' },
  ];

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleViewTransaction = (transaction: any) => {
    console.log('View transaction:', transaction);
  };

  const handleTransactionClick = (recentTransaction: any) => {
    setSelectedTransaction(recentTransaction.fullTransaction);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'qris': return '📱';
      case 'debit': return '💳';
      default: return '💵';
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <SidebarTrigger />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
                Selamat datang, {user?.name}!
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleNotificationRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
            <div className="hidden sm:flex items-center space-x-2">
              <div 
                className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/profile')}
              >
                <span className="text-white text-xs md:text-sm font-bold">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <span 
                className="text-xs md:text-sm font-medium hidden md:block cursor-pointer hover:underline"
                onClick={() => navigate('/profile')}
              >
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                onClick={stat.onClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
                  <CardTitle className="text-xs md:text-sm font-medium leading-tight">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0">
                  <div className="text-lg md:text-2xl font-bold truncate">{stat.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {stat.description}
                    </p>
                    <Badge 
                      variant={stat.trend === 'warning' ? 'destructive' : 'secondary'}
                      className={`text-xs flex-shrink-0 ml-1 ${stat.trend === 'warning' ? '' : 'text-green-600'}`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Transaksi Terbaru</CardTitle>
                <CardDescription className="text-sm">Transaksi hari ini</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm md:text-base">{transaction.id}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {transaction.time} • {transaction.items} item
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-medium text-sm md:text-base">{transaction.total}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.method}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-sm"
                  onClick={() => navigate('/transaction')}
                >
                  Mulai Transaksi Baru
                </Button>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 flex-shrink-0" />
                  <span>Peringatan Stok</span>
                </CardTitle>
                <CardDescription className="text-sm">Produk yang perlu direstock</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm md:text-base truncate">{item.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className={`font-medium text-sm md:text-base ${
                          item.status === 'empty' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {item.stock === 0 ? 'Habis' : `${item.stock} tersisa`}
                        </p>
                        <Badge 
                          variant={item.status === 'empty' ? 'destructive' : 'secondary'}
                          className={`text-xs ${item.status === 'empty' ? '' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {item.status === 'empty' ? 'Habis' : 'Sedikit'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-sm"
                  onClick={() => navigate('/stock')}
                >
                  Kelola Stok
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Transaction Detail Dialog for Recent Transactions */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Transaksi {selectedTransaction?.id}</DialogTitle>
              <DialogDescription>
                {selectedTransaction?.date} • {selectedTransaction?.time}
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Item yang dibeli:</h4>
                  {selectedTransaction.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="font-medium">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Metode Pembayaran:</span>
                    <span className="flex items-center space-x-1">
                      <span>{getPaymentMethodIcon(selectedTransaction.paymentMethod)}</span>
                      <span>
                        {selectedTransaction.paymentMethod === 'cash' ? 'Tunai' : 
                         selectedTransaction.paymentMethod === 'qris' ? 'QRIS' : 'Kartu Debit'}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>Rp {selectedTransaction.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Transaction History Dialog */}
        <Dialog open={showTransactionHistory} onOpenChange={setShowTransactionHistory}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Riwayat Transaksi Lengkap</DialogTitle>
              <DialogDescription>
                Filter dan lihat transaksi berdasarkan periode waktu
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto">
              <TransactionHistoryWithFilters
                transactions={sampleTransactions}
                onViewTransaction={handleViewTransaction}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Sales Detail Dialog */}
        <Dialog open={showSalesDetail} onOpenChange={setShowSalesDetail}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Penjualan Hari Ini</DialogTitle>
              <DialogDescription>Breakdown penjualan per jam</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">Rp 106,521</p>
                  <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Jam Tersibuk:</h4>
                <p className="text-sm text-muted-foreground">14:00 - 15:00 (8 transaksi)</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Detail Dialog */}
        <Dialog open={showProductDetail} onOpenChange={setShowProductDetail}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Produk</DialogTitle>
              <DialogDescription>Informasi stok dan kategori produk</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">98.2%</p>
                  <p className="text-sm text-muted-foreground">Stok Tersedia</p>
                </div>
              </div>
              <Button onClick={() => navigate('/stock')} className="w-full">
                Kelola Stok Produk
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profit Detail Dialog */}
        <Dialog open={showProfitDetail} onOpenChange={setShowProfitDetail}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Profit Bulan Ini</DialogTitle>
              <DialogDescription>Breakdown keuntungan dan target</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Target Tercapai</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">Rp 8.0 Juta</p>
                  <p className="text-sm text-muted-foreground">Target Sisa</p>
                </div>
              </div>
              <Button onClick={() => navigate('/analytics')} className="w-full">
                Lihat Analytics Lengkap
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;
