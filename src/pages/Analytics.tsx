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

  // Improved data generation based on period type
  const getSalesData = (range: string) => {
    switch (range) {
      case 'today':
        return Array.from({length: 24}, (_, i) => ({
          name: `${i.toString().padStart(2, '0')}:00`,
          sales: Math.random() * 500000 + 100000,
          transactions: Math.floor(Math.random() * 15) + 1
        }));
      
      case 'yesterday':
        return Array.from({length: 24}, (_, i) => ({
          name: `${i.toString().padStart(2, '0')}:00`,
          sales: Math.random() * 450000 + 80000,
          transactions: Math.floor(Math.random() * 12) + 1
        }));
      
      case 'week':
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        return days.map(day => ({
          name: day,
          sales: Math.random() * 3000000 + 1000000,
          transactions: Math.floor(Math.random() * 50) + 20
        }));
      
      case 'month':
        return Array.from({length: 30}, (_, i) => ({
          name: `${i + 1}`,
          sales: Math.random() * 2500000 + 800000,
          transactions: Math.floor(Math.random() * 40) + 15
        }));
      
      case 'quarter':
        const months3 = ['Bulan 1', 'Bulan 2', 'Bulan 3'];
        return months3.map(month => ({
          name: month,
          sales: Math.random() * 50000000 + 30000000,
          transactions: Math.floor(Math.random() * 800) + 400
        }));
      
      case 'year':
        const monthsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthsYear.map(month => ({
          name: month,
          sales: Math.random() * 60000000 + 40000000,
          transactions: Math.floor(Math.random() * 1000) + 500
        }));
      
      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) {
          return [];
        }
        
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        return Array.from({length: Math.min(diffDays, 31)}, (_, i) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear();
          
          // Format: DD/MM atau DD/MM/YYYY tergantung space
          const name = diffDays <= 15 ? `${day}/${month}/${year}` : `${day}/${month}`;
          
          return {
            name,
            sales: Math.random() * 2000000 + 800000,
            transactions: Math.floor(Math.random() * 35) + 10
          };
        });
      
      default:
        return [];
    }
  };

  // Enhanced stock movement data with proper 3-month support
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
      
      case 'quarter':
        // Fixed: Generate proper 3-month data
        const months = ['Bulan 1', 'Bulan 2', 'Bulan 3'];
        return months.map(month => ({
          name: month,
          stockIn: Math.floor(Math.random() * 3000) + 1000,
          stockOut: Math.floor(Math.random() * 2500) + 1200
        }));
      
      case 'year':
        const monthsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthsYear.map(month => ({
          name: month,
          stockIn: Math.floor(Math.random() * 3000) + 1000,
          stockOut: Math.floor(Math.random() * 2500) + 1200
        }));
      
      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) {
          return [];
        }
        
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        return Array.from({length: Math.min(diffDays, 31)}, (_, i) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear();
          
          const name = diffDays <= 15 ? `${day}/${month}/${year}` : `${day}/${month}`;
          
          return {
            name,
            stockIn: Math.floor(Math.random() * 150) + 30,
            stockOut: Math.floor(Math.random() * 120) + 40
          };
        });
      
      default:
        return [];
    }
  };

  // Dynamic category data with varying percentages based on period
  const getCategoryData = (range: string) => {
    const multiplier = range === 'today' ? 0.1 : range === 'week' ? 0.5 : range === 'month' ? 2 : 1;
    
    // Generate different percentage distributions based on period
    const basePercentages = {
      'today': [35, 25, 15, 12, 8, 5],
      'yesterday': [32, 23, 18, 14, 8, 5],
      'week': [28, 22, 20, 15, 10, 5],
      'month': [30, 20, 18, 15, 12, 5],
      'quarter': [25, 22, 20, 16, 12, 5],
      'year': [30, 20, 18, 15, 12, 5],
      'custom': [28, 21, 19, 16, 11, 5]
    };

    const percentages = basePercentages[range as keyof typeof basePercentages] || basePercentages['today'];
    
    return [
      { name: 'Sembako', value: percentages[0], sales: Math.floor(13500000 * multiplier * (percentages[0]/30)) },
      { name: 'Minuman', value: percentages[1], sales: Math.floor(9000000 * multiplier * (percentages[1]/20)) },
      { name: 'Makanan Instan', value: percentages[2], sales: Math.floor(8100000 * multiplier * (percentages[2]/18)) },
      { name: 'Kebersihan', value: percentages[3], sales: Math.floor(6750000 * multiplier * (percentages[3]/15)) },
      { name: 'Bundling', value: percentages[4], sales: Math.floor(5400000 * multiplier * (percentages[4]/12)) },
      { name: 'Lainnya', value: percentages[5], sales: Math.floor(2250000 * multiplier * (percentages[5]/5)) },
    ];
  };

  // Dynamic top products based on period
  const getTopProducts = (range: string) => {
    const multiplier = range === 'today' ? 0.1 : range === 'week' ? 0.5 : range === 'month' ? 2 : range === 'quarter' ? 6 : range === 'year' ? 12 : 1;
    
    // Different top products for different periods
    const productVariations = {
      'today': [
        { name: 'Indomie Goreng', sold: Math.floor(45 * multiplier), revenue: Math.floor(157500 * multiplier) },
        { name: 'Teh Botol Sosro', sold: Math.floor(38 * multiplier), revenue: Math.floor(152000 * multiplier) },
        { name: 'Beras Premium 5kg', sold: Math.floor(25 * multiplier), revenue: Math.floor(1875000 * multiplier) },
        { name: 'Minyak Goreng 1L', sold: Math.floor(22 * multiplier), revenue: Math.floor(396000 * multiplier) },
        { name: 'Paket Hemat Sembako', sold: Math.floor(8 * multiplier), revenue: Math.floor(792000 * multiplier) },
      ],
      'week': [
        { name: 'Beras Premium 5kg', sold: Math.floor(125 * multiplier), revenue: Math.floor(9375000 * multiplier) },
        { name: 'Paket Hemat Sembako', sold: Math.floor(45 * multiplier), revenue: Math.floor(4455000 * multiplier) },
        { name: 'Minyak Goreng 1L', sold: Math.floor(89 * multiplier), revenue: Math.floor(1602000 * multiplier) },
        { name: 'Indomie Goreng', sold: Math.floor(234 * multiplier), revenue: Math.floor(819000 * multiplier) },
        { name: 'Teh Botol Sosro', sold: Math.floor(156 * multiplier), revenue: Math.floor(624000 * multiplier) },
      ]
    };

    return productVariations[range as keyof typeof productVariations] || productVariations['week'];
  };

  const salesData = getSalesData(dateRange);
  const stockMovement = getStockMovementData(dateRange);
  const categoryData = getCategoryData(dateRange);
  const topProductsData = getTopProducts(dateRange);

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
            {/* Sales Chart */}
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

            {/* Category Distribution - Fixed percentages */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Distribusi Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Penjualan berdasarkan kategori produk - {getPeriodTitle(dateRange)}
                </CardDescription>
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
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{ fontSize: '10px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement - Fixed for 3 months */}
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col space-y-2">
                  <CardTitle className="text-base md:text-xl">Pergerakan Stok</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {getPeriodTitle(dateRange)} ({getChartTimeUnit(dateRange)})
                  </CardDescription>
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
                        angle={dateRange === 'month' ? -45 : 0}
                        textAnchor={dateRange === 'month' ? 'end' : 'middle'}
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

          <AnalyticsTransactionHistory
            dateRange={dateRange}
            selectedDate={selectedDate}
          />

          {/* Lower Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Produk Terlaris - {getPeriodTitle(dateRange)}</CardTitle>
                <CardDescription className="text-xs md:text-sm">5 produk dengan penjualan tertinggi termasuk bundling</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-4">
                  {topProductsData.map((product, index) => (
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

            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-xl">Performa Kategori</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Detail penjualan per kategori - {getPeriodTitle(dateRange)}
                </CardDescription>
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
