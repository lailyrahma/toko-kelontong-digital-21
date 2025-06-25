
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  AlertTriangle,
  Target
} from 'lucide-react';

interface MetricData {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface DashboardMetricsProps {
  period: string;
}

const DashboardMetrics = ({ period }: DashboardMetricsProps) => {
  // Sample data - in real app this would come from API/database
  const metrics: MetricData[] = [
    {
      title: 'Total Penjualan',
      value: 'Rp 15.450.000',
      subtitle: 'Omzet periode berjalan',
      change: { value: 12.5, type: 'increase', period: 'vs periode sebelumnya' },
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      title: 'Total Transaksi',
      value: 234,
      subtitle: 'Jumlah transaksi',
      change: { value: 8.2, type: 'increase', period: 'vs periode sebelumnya' },
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Produk Terjual',
      value: 1456,
      subtitle: 'Total item terjual',
      change: { value: 15.3, type: 'increase', period: 'vs periode sebelumnya' },
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Rata-rata Per Transaksi',
      value: 'Rp 66.025',
      subtitle: 'Pengeluaran rata-rata customer',
      change: { value: 3.8, type: 'increase', period: 'vs periode sebelumnya' },
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Penjualan Hari Ini',
      value: 'Rp 2.340.000',
      subtitle: 'Real-time performance',
      change: { value: 5.2, type: 'decrease', period: 'vs kemarin' },
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Total Produk',
      value: 156,
      subtitle: 'Item tersedia di sistem',
      icon: Package,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200'
    },
    {
      title: 'Stok Menipis',
      value: 12,
      subtitle: 'Produk perlu restock',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    {
      title: 'Profit Bulan Ini',
      value: 'Rp 4.680.000',
      subtitle: 'Estimasi keuntungan',
      change: { value: 18.7, type: 'increase', period: 'vs bulan lalu' },
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200'
    }
  ];

  const getPeriodDisplay = () => {
    switch (period) {
      case 'today': return 'Hari Ini';
      case 'yesterday': return 'Kemarin';
      case 'week': return '7 Hari Terakhir';
      case 'month': return '30 Hari Terakhir';
      case 'quarter': return '3 Bulan Terakhir';
      case 'year': return 'Tahun Ini';
      default: return 'Periode Dipilih';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ringkasan Performa</h3>
        <Badge variant="outline" className="text-xs">
          {getPeriodDisplay()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className={`hover:shadow-md transition-shadow ${metric.bgColor}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  {metric.change && (
                    <div className="flex items-center space-x-1">
                      {metric.change.type === 'increase' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change.value}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  {metric.subtitle && (
                    <p className="text-xs text-gray-500">{metric.subtitle}</p>
                  )}
                  {metric.change && (
                    <p className="text-xs text-gray-400">{metric.change.period}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardMetrics;
