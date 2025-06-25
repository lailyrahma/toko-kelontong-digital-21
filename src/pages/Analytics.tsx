import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, Package, DollarSign, Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DateRangeFilter from '@/components/analytics/DateRangeFilter';
import AnalyticsTransactionHistory from '@/components/analytics/AnalyticsTransactionHistory';
import StatsDetailDialog from '@/components/analytics/StatsDetailDialog';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('today');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStat, setSelectedStat] = useState<{type: string, title: string, data: any} | null>(null);
  const [stockPeriod, setStockPeriod] = useState('today');

  // Data penjualan per jam untuk hari ini
  const getHourlySalesData = () => [
    { time: '00:00', sales: 0, transactions: 0 },
    { time: '01:00', sales: 0, transactions: 0 },
    { time: '02:00', sales: 0, transactions: 0 },
    { time: '03:00', sales: 0, transactions: 0 },
    { time: '04:00', sales: 0, transactions: 0 },
    { time: '05:00', sales: 0, transactions: 0 },
    { time: '06:00', sales: 0, transactions: 0 },
    { time: '07:00', sales: 150000, transactions: 3 },
    { time: '08:00', sales: 280000, transactions: 5 },
    { time: '09:00', sales: 420000, transactions: 8 },
    { time: '10:00', sales: 380000, transactions: 7 },
    { time: '11:00', sales: 450000, transactions: 9 },
    { time: '12:00', sales: 520000, transactions: 12 },
    { time: '13:00', sales: 490000, transactions: 11 },
    { time: '14:00', sales: 380000, transactions: 8 },
    { time: '15:00', sales: 320000, transactions: 6 },
    { time: '16:00', sales: 280000, transactions: 5 },
    { time: '17:00', sales: 350000, transactions: 7 },
    { time: '18:00', sales: 420000, transactions: 9 },
    { time: '19:00', sales: 380000, transactions: 8 },
    { time: '20:00', sales: 290000, transactions: 6 },
    { time: '21:00', sales: 180000, transactions: 4 },
    { time: '22:00', sales: 120000, transactions: 2 },
    { time: '23:00', sales: 50000, transactions: 1 },
  ];

  // Sample data yang berubah berdasarkan filter
  const getSalesData = (range: string) => {
    const baseData = [
      { name: 'Senin', sales: 2400000, transactions: 45 },
      { name: 'Selasa', sales: 1398000, transactions: 32 },
      { name: 'Rabu', sales: 9800000, transactions: 78 },
      { name: 'Kamis', sales: 3908000, transactions: 56 },
      { name: 'Jumat', sales: 4800000, transactions: 67 },
      { name: 'Sabtu', sales: 3800000, transactions: 89 },
      { name: 'Minggu', sales: 4300000, transactions: 73 },
    ];

    switch (range) {
      case 'today':
        return getHourlySalesData();
      case 'yesterday':
        return [{ name: 'Kemarin', sales: 2100000, transactions: 19 }];
      case 'week':
        return baseData;
      case 'month':
        return [
          { name: 'Minggu 1', sales: 15400000, transactions: 156 },
          { name: 'Minggu 2', sales: 18200000, transactions: 189 },
          { name: 'Minggu 3', sales: 16800000, transactions: 172 },
          { name: 'Minggu 4', sales: 19600000, transactions: 203 },
        ];
      case 'year':
        return [
          { name: 'Jan', sales: 45200000, transactions: 567 },
          { name: 'Feb', sales: 52100000, transactions: 634 },
          { name: 'Mar', sales: 48900000, transactions: 598 },
          { name: 'Apr', sales: 51200000, transactions: 623 },
          { name: 'May', sales: 55800000, transactions: 687 },
          { name: 'Jun', sales: 49300000, transactions: 612 },
        ];
      default:
        return baseData;
    }
  };

  // Data pergerakan stok berdasarkan periode
  const getStockMovementData = (period: string) => {
    switch (period) {
      case 'today':
        return [
          { name: '00:00', stockIn: 0, stockOut: 0 },
          { name: '06:00', stockIn: 20, stockOut: 0 },
          { name: '08:00', stockIn: 5, stockOut: 15 },
          { name: '10:00', stockIn: 0, stockOut: 25 },
          { name: '12:00', stockIn: 0, stockOut: 35 },
          { name: '14:00', stockIn: 0, stockOut: 20 },
          { name: '16:00', stockIn: 0, stockOut: 18 },
          { name: '18:00', stockIn: 0, stockOut: 22 },
          { name: '20:00', stockIn: 0, stockOut: 15 },
          { name: '22:00', stockIn: 0, stockOut: 8 },
        ];
      case 'yesterday':
        return [
          { name: '00:00', stockIn: 0, stockOut: 0 },
          { name: '06:00', stockIn: 15, stockOut: 0 },
          { name: '08:00', stockIn: 8, stockOut: 12 },
          { name: '10:00', stockIn: 0, stockOut: 20 },
          { name: '12:00', stockIn: 0, stockOut: 30 },
          { name: '14:00', stockIn: 0, stockOut: 18 },
          { name: '16:00', stockIn: 0, stockOut: 15 },
          { name: '18:00', stockIn: 0, stockOut: 25 },
          { name: '20:00', stockIn: 0, stockOut: 12 },
          { name: '22:00', stockIn: 0, stockOut: 6 },
        ];
      case 'week':
        return [
          { name: 'Senin', stockIn: 120, stockOut: 89 },
          { name: 'Selasa', stockIn: 80, stockOut: 110 },
          { name: 'Rabu', stockIn: 150, stockOut: 120 },
          { name: 'Kamis', stockIn: 90, stockOut: 95 },
          { name: 'Jumat', stockIn: 110, stockOut: 130 },
          { name: 'Sabtu', stockIn: 70, stockOut: 145 },
          { name: 'Minggu', stockIn: 60, stockOut: 98 },
        ];
      case 'month':
        return [
          { name: 'Minggu 1', stockIn: 1200, stockOut: 890 },
          { name: 'Minggu 2', stockIn: 800, stockOut: 1100 },
          { name: 'Minggu 3', stockIn: 1500, stockOut: 1200 },
          { name: 'Minggu 4', stockIn: 900, stockOut: 950 },
        ];
      case 'year':
        return [
          { name: 'Jan', stockIn: 4500, stockOut: 3800 },
          { name: 'Feb', stockIn: 3200, stockOut: 4200 },
          { name: 'Mar', stockIn: 5100, stockOut: 4800 },
          { name: 'Apr', stockIn: 3800, stockOut: 4100 },
          { name: 'May', stockIn: 4200, stockOut: 4600 },
          { name: 'Jun', stockIn: 3600, stockOut: 4200 },
        ];
      default:
        return [
          { name: 'Minggu 1', stockIn: 1200, stockOut: 890 },
          { name: 'Minggu 2', stockIn: 800, stockOut: 1100 },
          { name: 'Minggu 3', stockIn: 1500, stockOut: 1200 },
          { name: 'Minggu 4', stockIn: 900, stockOut: 950 },
        ];
    }
  };

  const salesData = getSalesData(dateRange);
  const stockMovement = getStockMovementData(stockPeriod);

  const categoryData = [
    { name: 'Sembako', value: 35, sales: 15750000 },
    { name: 'Minuman', value: 25, sales: 11250000 },
    { name: 'Makanan Instan', value: 20, sales: 9000000 },
    { name: 'Kebersihan', value: 15, sales: 6750000 },
    { name: 'Lainnya', value: 5, sales: 2250000 },
  ];

  const topProducts = [
    { name: 'Beras Premium 5kg', sold: 125, revenue: 9375000 },
    { name: 'Minyak Goreng 1L', sold: 89, revenue: 1602000 },
    { name: 'Indomie Goreng', sold: 234, revenue: 819000 },
    { name: 'Teh Botol Sosro', sold: 156, revenue: 624000 },
    { name: 'Sabun Mandi Lifebuoy', sold: 67, revenue: 569500 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const getStatsForPeriod = (period: string) => {
    const baseSales = 45200000;
    const baseTransactions = 1234;
    const baseProducts = 8945;
    const baseAverage = 36650;

    const multipliers: { [key: string]: number } = {
      'today': 0.05,
      'yesterday': 0.045,
      'week': 0.2,
      'month': 1,
      'year': 12,
      'custom': 1
    };

    const multiplier = multipliers[period] || 1;
    
    // Perhitungan persentase performa dibanding periode sebelumnya
    const getPerformanceChange = (current: number, previous: number) => {
      const change = ((current - previous) / previous) * 100;
      return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    const currentSales = baseSales * multiplier;
    const previousSales = baseSales * multiplier * 0.88; // 12% lebih rendah dari periode sebelumnya
    
    return [
      {
        title: 'Total Penjualan',
        value: `Rp ${(currentSales / 1000000).toFixed(1)} Juta`,
        change: getPerformanceChange(currentSales, previousSales),
        icon: DollarSign,
        description: period === 'today' ? 'Hari ini' : period === 'week' ? 'Minggu ini' : period === 'month' ? 'Bulan ini' : 'Tahun ini',
        type: 'sales',
        performance: 'positive'
      },
      {
        title: 'Total Transaksi',
        value: Math.round(baseTransactions * multiplier).toLocaleString(),
        change: '+8.2%',
        icon: ShoppingCart,
        description: period === 'today' ? 'Hari ini' : period === 'week' ? 'Minggu ini' : period === 'month' ? 'Bulan ini' : 'Tahun ini',
        type: 'transactions',
        performance: 'positive'
      },
      {
        title: 'Produk Terjual',
        value: Math.round(baseProducts * multiplier).toLocaleString(),
        change: '+15.3%',
        icon: Package,
        description: 'Unit terjual',
        type: 'products',
        performance: 'positive'
      },
      {
        title: 'Rata-rata per Transaksi',
        value: `Rp ${baseAverage.toLocaleString()}`,
        change: '+4.1%',
        icon: TrendingUp,
        description: 'Per transaksi',
        type: 'average',
        performance: 'positive'
      }
    ];
  };

  const stats = getStatsForPeriod(dateRange);

  const getPeriodTitle = (period: string) => {
    switch (period) {
      case 'today': return 'Hari Ini';
      case 'yesterday': return 'Kemarin';
      case 'week': return '7 Hari Terakhir';
      case 'month': return '30 Hari Terakhir';
      case 'quarter': return '3 Bulan Terakhir';
      case 'year': return 'Tahun Ini';
      case 'custom': return 'Custom';
      default: return 'Periode Dipilih';
    }
  };

  const getStockPeriodTitle = (period: string) => {
    switch (period) {
      case 'today': return 'Hari Ini (Per Jam)';
      case 'yesterday': return 'Kemarin (Per Jam)';
      case 'week': return 'Mingguan (Per Hari)';
      case 'month': return 'Bulanan (Per Minggu)';
      case 'year': return 'Tahunan (Per Bulan)';
      default: return 'Periode Dipilih';
    }
  };

  const handleStatClick = (stat: any) => {
    setSelectedStat({
      type: stat.type,
      title: stat.title,
      data: stat
    });
  };

  return (
    <TooltipProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 md:p-6 border-b bg-white">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-bold truncate">Analytics & Insights</h1>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 bg-gray-50 space-y-3 md:space-y-6 min-w-0 overflow-x-hidden">
          {/* Date Range Filter */}
          <DateRangeFilter
            dateRange={dateRange}
            selectedDate={selectedDate}
            onDateRangeChange={setDateRange}
            onDateChange={setSelectedDate}
          />

          {/* Stats Overview - Enhanced with Tooltips */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="min-w-0 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatClick(stat)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <stat.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <UITooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Persentase dibanding periode sebelumnya
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0">
                  <div className="text-base md:text-2xl font-bold truncate">{stat.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.description}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${stat.performance === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs font-medium flex-shrink-0 ml-1 ${stat.performance === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section - Responsive Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6">
            {/* Sales Chart - Enhanced for Hourly Data */}
            <Card className="xl:col-span-2 min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">
                  Tren Penjualan - {getPeriodTitle(dateRange)}
                  {dateRange === 'today' && <span className="text-sm text-muted-foreground ml-2">(Per Jam)</span>}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Penjualan untuk periode {getPeriodTitle(dateRange).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="h-48 md:h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={dateRange === 'today' ? 'time' : 'name'}
                        fontSize={10}
                        tick={{ fontSize: 8 }}
                        interval={dateRange === 'today' ? 2 : 0}
                        angle={dateRange === 'today' ? -45 : -45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fontSize: 8 }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
                        labelStyle={{ fontSize: '10px' }}
                        contentStyle={{ fontSize: '10px' }}
                      />
                      <Bar dataKey="sales" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Distribusi Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">Penjualan berdasarkan kategori produk</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="h-48 md:h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement - Enhanced with Period Filter */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col space-y-2">
                  <CardTitle className="text-base md:text-xl">Pergerakan Stok</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {getStockPeriodTitle(stockPeriod)}
                  </CardDescription>
                  <select 
                    value={stockPeriod}
                    onChange={(e) => setStockPeriod(e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-full max-w-xs"
                  >
                    <option value="today">Hari Ini (Per Jam)</option>
                    <option value="yesterday">Kemarin (Per Jam)</option>
                    <option value="week">Mingguan (Per Hari)</option>
                    <option value="month">Bulanan (Per Minggu)</option>
                    <option value="year">Tahunan (Per Bulan)</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="h-48 md:h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockMovement} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10}
                        tick={{ fontSize: 8 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fontSize: 8 }}
                      />
                      <Tooltip 
                        labelStyle={{ fontSize: '10px' }}
                        contentStyle={{ fontSize: '10px' }}
                      />
                      <Line type="monotone" dataKey="stockIn" stroke="#00C49F" name="Stok Masuk" strokeWidth={2} />
                      <Line type="monotone" dataKey="stockOut" stroke="#FF8042" name="Stok Keluar" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Riwayat Transaksi */}
          <AnalyticsTransactionHistory
            dateRange={dateRange}
            selectedDate={selectedDate}
          />

          {/* Lower Section - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            {/* Top Products */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Produk Terlaris - {getPeriodTitle(dateRange)}</CardTitle>
                <CardDescription className="text-xs md:text-sm">5 produk dengan penjualan tertinggi untuk periode ini</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg min-w-0">
                      <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                        <div className="w-5 h-5 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs md:text-base truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sold} unit terjual</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-xs md:text-base">Rp {product.revenue.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Performa Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">Detail penjualan per kategori</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-4 border rounded-lg min-w-0">
                      <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                        <div
                          className="w-2 h-2 md:w-4 md:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs md:text-base truncate">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.value}% dari total penjualan</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-xs md:text-base">Rp {category.sales.toLocaleString('id-ID')}</p>
                        <div className="w-12 md:w-24 bg-gray-200 rounded-full h-1.5 md:h-2 mt-1">
                          <div
                            className="bg-primary h-1.5 md:h-2 rounded-full transition-all"
                            style={{ width: `${category.value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Stats Detail Dialog */}
      <StatsDetailDialog
        isOpen={!!selectedStat}
        onClose={() => setSelectedStat(null)}
        title={selectedStat?.title || ''}
        data={selectedStat?.data}
        type={selectedStat?.type as any}
      />
    </TooltipProvider>
  );
};

export default Analytics;
