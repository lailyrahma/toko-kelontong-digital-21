import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, Package, DollarSign, Info, Clock, Calendar } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
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

  const getCategoryData = (range: string) => {
    const multiplier = range === 'today' ? 0.1 : range === 'week' ? 0.5 : range === 'month' ? 2 : 1;
    
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
      { 
        name: 'Sembako', 
        value: percentages[0], 
        sales: Math.floor(13500000 * multiplier * (percentages[0]/30)),
        description: 'Beras, minyak goreng, gula, tepung',
        items: ['Beras Premium 5kg', 'Minyak Goreng 1L', 'Gula Pasir 1kg', 'Tepung Terigu']
      },
      { 
        name: 'Minuman', 
        value: percentages[1], 
        sales: Math.floor(9000000 * multiplier * (percentages[1]/20)),
        description: 'Teh, kopi, air mineral, soft drink',
        items: ['Teh Botol Sosro', 'Kopi Kapal Api', 'Aqua 600ml', 'Coca Cola']
      },
      { 
        name: 'Makanan Instan', 
        value: percentages[2], 
        sales: Math.floor(8100000 * multiplier * (percentages[2]/18)),
        description: 'Mie instan, snack, biskuit',
        items: ['Indomie Goreng', 'Chitato', 'Oreo', 'Pocky']
      },
      { 
        name: 'Kebersihan', 
        value: percentages[3], 
        sales: Math.floor(6750000 * multiplier * (percentages[3]/15)),
        description: 'Sabun, deterjen, shampoo, pasta gigi',
        items: ['Sabun Lifebuoy', 'Rinso', 'Pantene', 'Pepsodent']
      },
      { 
        name: 'Bundling', 
        value: percentages[4], 
        sales: Math.floor(5400000 * multiplier * (percentages[4]/12)),
        description: 'Paket hemat berbagai kategori',
        items: ['Paket Sembako', 'Paket Mandi', 'Paket Sarapan', 'Paket Snack']
      },
      { 
        name: 'Lainnya', 
        value: percentages[5], 
        sales: Math.floor(2250000 * multiplier * (percentages[5]/5)),
        description: 'Alat tulis, obat-obatan, aksesoris',
        items: ['Pulpen', 'Bodrex', 'Baterai AA', 'Korek Api']
      },
    ];
  };

  const getTopProducts = (range: string) => {
    const multiplier = range === 'today' ? 0.1 : range === 'week' ? 0.5 : range === 'month' ? 2 : range === 'quarter' ? 6 : range === 'year' ? 12 : 1;
    
    const getTimingInfo = (range: string) => {
      switch (range) {
        case 'today':
          return {
            period: 'Hari ini',
            timeDetails: ['08:00-12:00', '13:00-17:00', '18:00-22:00']
          };
        case 'yesterday':
          return {
            period: 'Kemarin',
            timeDetails: ['Pagi: 30%', 'Siang: 45%', 'Malam: 25%']
          };
        case 'week':
          return {
            period: '7 hari terakhir',
            timeDetails: ['Sen-Jum: 70%', 'Sabtu: 20%', 'Minggu: 10%']
          };
        case 'month':
          return {
            period: '30 hari terakhir',
            timeDetails: ['Minggu 1-2: 60%', 'Minggu 3-4: 40%']
          };
        case 'quarter':
          return {
            period: '3 bulan terakhir',
            timeDetails: ['Bulan 1: 35%', 'Bulan 2: 30%', 'Bulan 3: 35%']
          };
        case 'year':
          return {
            period: 'Tahun ini',
            timeDetails: ['Q1: 25%', 'Q2: 30%', 'Q3: 25%', 'Q4: 20%']
          };
        default:
          return {
            period: 'Custom',
            timeDetails: ['Terdistribusi merata']
          };
      }
    };

    const timing = getTimingInfo(range);

    const productVariations = {
      'today': [
        { 
          name: 'Indomie Goreng', 
          sold: Math.floor(45 * multiplier), 
          revenue: Math.floor(157500 * multiplier),
          category: 'Makanan Instan',
          peakTime: '19:00-21:00',
          trend: '+12%',
          lastSold: '2 jam lalu'
        },
        { 
          name: 'Teh Botol Sosro', 
          sold: Math.floor(38 * multiplier), 
          revenue: Math.floor(152000 * multiplier),
          category: 'Minuman',
          peakTime: '12:00-14:00',
          trend: '+8%',
          lastSold: '30 menit lalu'
        },
        { 
          name: 'Beras Premium 5kg', 
          sold: Math.floor(25 * multiplier), 
          revenue: Math.floor(1875000 * multiplier),
          category: 'Sembako',
          peakTime: '08:00-10:00',
          trend: '+15%',
          lastSold: '1 jam lalu'
        },
        { 
          name: 'Minyak Goreng 1L', 
          sold: Math.floor(22 * multiplier), 
          revenue: Math.floor(396000 * multiplier),
          category: 'Sembako',
          peakTime: '16:00-18:00',
          trend: '+5%',
          lastSold: '45 menit lalu'
        },
        { 
          name: 'Paket Hemat Sembako', 
          sold: Math.floor(8 * multiplier), 
          revenue: Math.floor(792000 * multiplier),
          category: 'Bundling',
          peakTime: '09:00-11:00',
          trend: '+20%',
          lastSold: '3 jam lalu'
        },
      ],
      'week': [
        { 
          name: 'Beras Premium 5kg', 
          sold: Math.floor(125 * multiplier), 
          revenue: Math.floor(9375000 * multiplier),
          category: 'Sembako',
          peakTime: 'Senin-Rabu',
          trend: '+18%',
          lastSold: 'Hari ini'
        },
        { 
          name: 'Paket Hemat Sembako', 
          sold: Math.floor(45 * multiplier), 
          revenue: Math.floor(4455000 * multiplier),
          category: 'Bundling',
          peakTime: 'Jumat-Minggu',
          trend: '+25%',
          lastSold: 'Kemarin'
        },
        { 
          name: 'Minyak Goreng 1L', 
          sold: Math.floor(89 * multiplier), 
          revenue: Math.floor(1602000 * multiplier),
          category: 'Sembako',
          peakTime: 'Selasa-Kamis',
          trend: '+10%',
          lastSold: 'Hari ini'
        },
        { 
          name: 'Indomie Goreng', 
          sold: Math.floor(234 * multiplier), 
          revenue: Math.floor(819000 * multiplier),
          category: 'Makanan Instan',
          peakTime: 'Sabtu-Minggu',
          trend: '+15%',
          lastSold: 'Hari ini'
        },
        { 
          name: 'Teh Botol Sosro', 
          sold: Math.floor(156 * multiplier), 
          revenue: Math.floor(624000 * multiplier),
          category: 'Minuman',
          peakTime: 'Setiap hari',
          trend: '+12%',
          lastSold: 'Hari ini'
        },
      ]
    };

    return {
      products: productVariations[range as keyof typeof productVariations] || productVariations['week'],
      timing
    };
  };

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

    const getPercentageChanges = (period: string) => {
      switch (period) {
        case 'today':
          return {
            sales: '+5.2%',
            transactions: '+3.8%',
            products: '+7.1%',
            average: '+2.4%'
          };
        case 'yesterday':
          return {
            sales: '+4.1%',
            transactions: '+2.9%',
            products: '+6.3%',
            average: '+1.8%'
          };
        case 'week':
          return {
            sales: '+12.5%',
            transactions: '+8.2%',
            products: '+15.3%',
            average: '+4.1%'
          };
        case 'month':
          return {
            sales: '+18.7%',
            transactions: '+12.1%',
            products: '+22.4%',
            average: '+6.8%'
          };
        case 'quarter':
          return {
            sales: '+25.3%',
            transactions: '+19.6%',
            products: '+28.1%',
            average: '+8.9%'
          };
        case 'year':
          return {
            sales: '+45.2%',
            transactions: '+38.7%',
            products: '+52.3%',
            average: '+12.4%'
          };
        case 'custom':
          return {
            sales: '+15.8%',
            transactions: '+11.2%',
            products: '+18.6%',
            average: '+5.7%'
          };
        default:
          return {
            sales: '+12.5%',
            transactions: '+8.2%',
            products: '+15.3%',
            average: '+4.1%'
          };
      }
    };

    const multiplier = multipliers[period] || 1;
    const percentages = getPercentageChanges(period);
    
    const currentSales = baseSales * multiplier;
    
    return [
      {
        title: 'Total Penjualan',
        value: `Rp ${(currentSales / 1000000).toFixed(1)} Juta`,
        change: percentages.sales,
        icon: DollarSign,
        description: getPeriodDescription(period),
        type: 'sales',
        performance: 'positive'
      },
      {
        title: 'Total Transaksi',
        value: Math.round(baseTransactions * multiplier).toLocaleString(),
        change: percentages.transactions,
        icon: ShoppingCart,
        description: getPeriodDescription(period),
        type: 'transactions',
        performance: 'positive'
      },
      {
        title: 'Produk Terjual',
        value: Math.round(baseProducts * multiplier).toLocaleString(),
        change: percentages.products,
        icon: Package,
        description: 'Unit terjual',
        type: 'products',
        performance: 'positive'
      },
      {
        title: 'Rata-rata per Transaksi',
        value: `Rp ${baseAverage.toLocaleString()}`,
        change: percentages.average,
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

  const salesData = getSalesData(dateRange);
  const stockMovement = getStockMovementData(dateRange);
  const categoryData = getCategoryData(dateRange);
  const topProductsInfo = getTopProducts(dateRange);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            <Card className="min-w-0">
              <CardHeader className="p-3 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base md:text-xl">
                      Produk Terlaris - {getPeriodTitle(dateRange)}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      5 produk dengan penjualan tertinggi • {topProductsInfo.timing.period}
                    </CardDescription>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">Distribusi Waktu Penjualan:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topProductsInfo.timing.timeDetails.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:space-y-4">
                  {topProductsInfo.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg min-w-0 border">
                      <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                        <div className="w-5 h-5 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-xs md:text-base truncate">{product.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>{product.sold} unit terjual</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{product.peakTime}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-green-600 font-medium">
                              {product.trend} vs periode lalu
                            </span>
                            <span className="text-xs text-gray-500">
                              • Terakhir: {product.lastSold}
                            </span>
                          </div>
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
                  Breakdown penjualan per kategori dengan detail produk - {getPeriodTitle(dateRange)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="border rounded-lg p-3 md:p-4 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                          <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-sm md:text-base truncate">{category.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {category.value}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
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
                      
                      <div className="border-t pt-2 mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Produk Utama:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {category.items.map((item, itemIndex) => (
                            <Badge key={itemIndex} variant="secondary" className="text-xs justify-start">
                              {item}
                            </Badge>
                          ))}
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
