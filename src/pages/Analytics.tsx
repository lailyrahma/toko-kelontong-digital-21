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
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({ startDate: undefined, endDate: undefined });
  const [selectedStat, setSelectedStat] = useState<{type: string, title: string, data: any} | null>(null);
  const [stockPeriod, setStockPeriod] = useState('today');

  // Improved data generation based on period type
  const getSalesData = (range: string) => {
    switch (range) {
      case 'today':
        // Per jam untuk hari ini
        return Array.from({length: 24}, (_, i) => ({
          name: `${i.toString().padStart(2, '0')}:00`,
          sales: Math.random() * 500000 + 100000,
          transactions: Math.floor(Math.random() * 15) + 1
        }));
      
      case 'yesterday':
        // Per jam untuk kemarin
        return Array.from({length: 24}, (_, i) => ({
          name: `${i.toString().padStart(2, '0')}:00`,
          sales: Math.random() * 450000 + 80000,
          transactions: Math.floor(Math.random() * 12) + 1
        }));
      
      case 'week':
        // Per hari untuk 7 hari terakhir
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        return days.map(day => ({
          name: day,
          sales: Math.random() * 3000000 + 1000000,
          transactions: Math.floor(Math.random() * 50) + 20
        }));
      
      case 'month':
        // Per tanggal untuk 30 hari terakhir
        return Array.from({length: 30}, (_, i) => ({
          name: `${i + 1}`,
          sales: Math.random() * 2500000 + 800000,
          transactions: Math.floor(Math.random() * 40) + 15
        }));
      
      case 'quarter':
        // Per bulan untuk 3 bulan terakhir
        const months3 = ['Bulan 1', 'Bulan 2', 'Bulan 3'];
        return months3.map(month => ({
          name: month,
          sales: Math.random() * 50000000 + 30000000,
          transactions: Math.floor(Math.random() * 800) + 400
        }));
      
      case 'year':
        // Per bulan untuk tahun ini
        const monthsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthsYear.map(month => ({
          name: month,
          sales: Math.random() * 60000000 + 40000000,
          transactions: Math.floor(Math.random() * 1000) + 500
        }));
      
      case 'custom':
        // Data berdasarkan custom range (contoh per hari)
        const customDays = Math.abs(
          Math.floor((customDateRange.endDate?.getTime() || Date.now()) - 
                    (customDateRange.startDate?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)
        ) + 1;
        return Array.from({length: Math.min(customDays, 31)}, (_, i) => ({
          name: `Hari ${i + 1}`,
          sales: Math.random() * 2000000 + 800000,
          transactions: Math.floor(Math.random() * 35) + 10
        }));
      
      default:
        return [];
    }
  };

  // Enhanced stock movement data
  const getStockMovementData = (period: string) => {
    switch (period) {
      case 'today':
      case 'yesterday':
        return Array.from({length: 24}, (_, i) => ({
          name: `${i.toString().padStart(2, '0')}:00`,
          stockIn: Math.floor(Math.random() * 30),
          stockOut: Math.floor(Math.random() * 25) + 5
        }));
      
      case 'week':
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        return days.map(day => ({
          name: day,
          stockIn: Math.floor(Math.random() * 200) + 50,
          stockOut: Math.floor(Math.random() * 180) + 70
        }));
      
      case 'month':
        return Array.from({length: 30}, (_, i) => ({
          name: `${i + 1}`,
          stockIn: Math.floor(Math.random() * 150) + 30,
          stockOut: Math.floor(Math.random() * 120) + 40
        }));
      
      case 'year':
        const monthsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthsYear.map(month => ({
          name: month,
          stockIn: Math.floor(Math.random() * 3000) + 1000,
          stockOut: Math.floor(Math.random() * 2500) + 1200
        }));
      
      default:
        return [];
    }
  };

  const salesData = getSalesData(dateRange);
  const stockMovement = getStockMovementData(stockPeriod);

  // Enhanced category data including bundling
  const categoryData = [
    { name: 'Sembako', value: 30, sales: 13500000 },
    { name: 'Minuman', value: 20, sales: 9000000 },
    { name: 'Makanan Instan', value: 18, sales: 8100000 },
    { name: 'Kebersihan', value: 15, sales: 6750000 },
    { name: 'Bundling', value: 12, sales: 5400000 },
    { name: 'Lainnya', value: 5, sales: 2250000 },
  ];

  const topProducts = [
    { name: 'Beras Premium 5kg', sold: 125, revenue: 9375000 },
    { name: 'Minyak Goreng 1L', sold: 89, revenue: 1602000 },
    { name: 'Paket Hemat Sembako (Bundling)', sold: 45, revenue: 4455000 },
    { name: 'Indomie Goreng', sold: 234, revenue: 819000 },
    { name: 'Teh Botol Sosro', sold: 156, revenue: 624000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
      'quarter': 3,
      'year': 12,
      'custom': 1
    };

    const multiplier = multipliers[period] || 1;
    
    const getPerformanceChange = (current: number, previous: number) => {
      const change = ((current - previous) / previous) * 100;
      return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    const currentSales = baseSales * multiplier;
    const previousSales = baseSales * multiplier * 0.88;
    
    return [
      {
        title: 'Total Penjualan',
        value: `Rp ${(currentSales / 1000000).toFixed(1)} Juta`,
        change: getPerformanceChange(currentSales, previousSales),
        icon: DollarSign,
        description: getPeriodDescription(period),
        type: 'sales',
        performance: 'positive'
      },
      {
        title: 'Total Transaksi',
        value: Math.round(baseTransactions * multiplier).toLocaleString(),
        change: '+8.2%',
        icon: ShoppingCart,
        description: getPeriodDescription(period),
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

  const getPeriodDescription = (period: string) => {
    switch (period) {
      case 'today': return 'Hari ini';
      case 'yesterday': return 'Kemarin';
      case 'week': return '7 hari terakhir';
      case 'month': return '30 hari terakhir';
      case 'quarter': return '3 bulan terakhir';
      case 'year': return 'Tahun ini';
      case 'custom': return 'Periode custom';
      default: return 'Periode dipilih';
    }
  };

  const getPeriodTitle = (period: string) => {
    switch (period) {
      case 'today': return 'Hari Ini';
      case 'yesterday': return 'Kemarin';
      case 'week': return '7 Hari Terakhir';
      case 'month': return '30 Hari Terakhir';
      case 'quarter': return '3 Bulan Terakhir';
      case 'year': return 'Tahun Ini';
      case 'custom': return 'Custom Range';
      default: return 'Periode Dipilih';
    }
  };

  const getChartTimeUnit = (period: string) => {
    switch (period) {
      case 'today':
      case 'yesterday':
        return 'Per Jam';
      case 'week':
        return 'Per Hari';
      case 'month':
        return 'Per Tanggal';
      case 'quarter':
      case 'year':
        return 'Per Bulan';
      case 'custom':
        return 'Per Periode';
      default:
        return '';
    }
  };

  const stats = getStatsForPeriod(dateRange);

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
          {/* Enhanced Date Range Filter */}
          <DateRangeFilter
            dateRange={dateRange}
            selectedDate={selectedDate}
            customDateRange={customDateRange}
            onDateRangeChange={setDateRange}
            onDateChange={setSelectedDate}
            onCustomDateRangeChange={setCustomDateRange}
          />

          {/* Stats Overview */}
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

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6">
            {/* Sales Chart with Period-Specific Labels */}
            <Card className="xl:col-span-2 min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">
                  Tren Penjualan - {getPeriodTitle(dateRange)}
                  <span className="text-sm text-muted-foreground ml-2">({getChartTimeUnit(dateRange)})</span>
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
                        dataKey="name"
                        fontSize={10}
                        tick={{ fontSize: 8 }}
                        interval={dateRange === 'today' || dateRange === 'yesterday' ? 2 : 0}
                        angle={dateRange === 'month' ? -45 : 0}
                        textAnchor={dateRange === 'month' ? 'end' : 'middle'}
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

            {/* Enhanced Category Distribution with Bundling */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Distribusi Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">Penjualan berdasarkan kategori produk termasuk bundling</CardDescription>
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

            {/* Enhanced Stock Movement */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col space-y-2">
                  <CardTitle className="text-base md:text-xl">Pergerakan Stok</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {getPeriodTitle(stockPeriod)} ({getChartTimeUnit(stockPeriod)})
                  </CardDescription>
                  <select 
                    value={stockPeriod}
                    onChange={(e) => setStockPeriod(e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-full max-w-xs"
                  >
                    <option value="today">Hari Ini (Per Jam)</option>
                    <option value="yesterday">Kemarin (Per Jam)</option>
                    <option value="week">7 Hari Terakhir (Per Hari)</option>
                    <option value="month">30 Hari Terakhir (Per Tanggal)</option>
                    <option value="year">Tahun Ini (Per Bulan)</option>
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
                        angle={stockPeriod === 'month' ? -45 : 0}
                        textAnchor={stockPeriod === 'month' ? 'end' : 'middle'}
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

          {/* Lower Section with Enhanced Top Products including Bundling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Produk Terlaris - {getPeriodTitle(dateRange)}</CardTitle>
                <CardDescription className="text-xs md:text-sm">5 produk dengan penjualan tertinggi termasuk bundling</CardDescription>
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

            {/* Enhanced Category Performance with Bundling */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Performa Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">Detail penjualan per kategori termasuk bundling</CardDescription>
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
