
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import EnhancedDateRangeFilter from '@/components/analytics/EnhancedDateRangeFilter';
import DashboardMetrics from '@/components/analytics/DashboardMetrics';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('today');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  // Generate sample data based on selected period
  const generateSalesData = () => {
    switch (dateRange) {
      case 'today':
      case 'yesterday':
        // Hourly data for today/yesterday
        return Array.from({ length: 24 }, (_, i) => ({
          time: `${i.toString().padStart(2, '0')}:00`,
          penjualan: Math.floor(Math.random() * 500000) + 100000,
          transaksi: Math.floor(Math.random() * 20) + 5,
          profit: Math.floor(Math.random() * 150000) + 30000
        }));
        
      case 'week':
      case 'month':
        // Daily data for week/month
        const days = dateRange === 'week' ? 7 : 30;
        return Array.from({ length: days }, (_, i) => ({
          time: `Hari ${i + 1}`,
          penjualan: Math.floor(Math.random() * 2000000) + 500000,
          transaksi: Math.floor(Math.random() * 50) + 20,
          profit: Math.floor(Math.random() * 600000) + 150000
        }));
        
      case 'quarter':
      case 'year':
        // Monthly data for quarter/year
        const months = dateRange === 'quarter' ? 3 : 12;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        return Array.from({ length: months }, (_, i) => ({
          time: monthNames[i],
          penjualan: Math.floor(Math.random() * 10000000) + 5000000,
          transaksi: Math.floor(Math.random() * 500) + 200,
          profit: Math.floor(Math.random() * 3000000) + 1500000
        }));
        
      default:
        return [];
    }
  };

  const salesData = generateSalesData();

  const productSalesData = [
    { name: 'Beras Premium', value: 450000, percentage: 28.5 },
    { name: 'Minyak Goreng', value: 320000, percentage: 20.3 },
    { name: 'Gula Pasir', value: 280000, percentage: 17.8 },
    { name: 'Indomie Goreng', value: 250000, percentage: 15.9 },
    { name: 'Paket Sembako', value: 200000, percentage: 12.7 },
    { name: 'Lainnya', value: 80000, percentage: 4.8 }
  ];

  const stockMovementData = [
    { name: 'Beras Premium', masuk: 100, keluar: 85, sisa: 15 },
    { name: 'Minyak Goreng', masuk: 50, keluar: 45, sisa: 5 },
    { name: 'Gula Pasir', masuk: 75, keluar: 75, sisa: 0 },
    { name: 'Indomie Goreng', masuk: 200, keluar: 100, sisa: 100 },
    { name: 'Teh Botol', masuk: 24, keluar: 16, sisa: 8 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const getTimeLabel = () => {
    switch (dateRange) {
      case 'today':
      case 'yesterday':
        return 'Jam';
      case 'week':
      case 'month':
        return 'Hari';
      case 'quarter':
      case 'year':
        return 'Bulan';
      default:
        return 'Periode';
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Analisis Penjualan</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50 space-y-6">
          {/* Enhanced Date Range Filter */}
          <EnhancedDateRangeFilter
            dateRange={dateRange}
            selectedDate={selectedDate}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onDateRangeChange={setDateRange}
            onDateChange={setSelectedDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
          />

          {/* Dashboard Metrics */}
          <DashboardMetrics period={dateRange} />

          {/* Sales Trend Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Tren Penjualan {getTimeLabel() === 'Jam' ? 'per Jam' : `per ${getTimeLabel()}`}</span>
                </CardTitle>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>Real-time</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      angle={dateRange === 'today' || dateRange === 'yesterday' ? -45 : 0}
                      textAnchor={dateRange === 'today' || dateRange === 'yesterday' ? 'end' : 'middle'}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `Rp ${value.toLocaleString('id-ID')}`,
                        name === 'penjualan' ? 'Penjualan' : name === 'profit' ? 'Profit' : 'Transaksi'
                      ]}
                      labelFormatter={(label) => `${getTimeLabel()}: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="penjualan" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Produk Terlaris</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productSalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productSalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Pergerakan Stok</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockMovementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="masuk" fill="#22c55e" name="Masuk" />
                      <Bar dataKey="keluar" fill="#ef4444" name="Keluar" />
                      <Bar dataKey="sisa" fill="#3b82f6" name="Sisa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performa Transaksi per {getTimeLabel()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      angle={dateRange === 'today' || dateRange === 'yesterday' ? -45 : 0}
                      textAnchor={dateRange === 'today' || dateRange === 'yesterday' ? 'end' : 'middle'}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'transaksi' ? `${value} transaksi` : `Rp ${value.toLocaleString('id-ID')}`,
                        name === 'transaksi' ? 'Jumlah Transaksi' : 'Total Penjualan'
                      ]}
                      labelFormatter={(label) => `${getTimeLabel()}: ${label}`}
                    />
                    <Bar dataKey="transaksi" fill="#8884d8" name="transaksi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Analytics;
