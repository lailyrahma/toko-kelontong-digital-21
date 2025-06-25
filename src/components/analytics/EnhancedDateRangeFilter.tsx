
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface EnhancedDateRangeFilterProps {
  dateRange: string;
  selectedDate: Date | undefined;
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  onDateRangeChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
}

const EnhancedDateRangeFilter = ({ 
  dateRange, 
  selectedDate, 
  customStartDate,
  customEndDate,
  onDateRangeChange, 
  onDateChange,
  onCustomStartDateChange,
  onCustomEndDateChange
}: EnhancedDateRangeFilterProps) => {
  const getDisplayFormat = () => {
    switch (dateRange) {
      case 'today':
      case 'yesterday':
        return { icon: Clock, text: 'Per Jam', description: 'Analisis detail per jam' };
      case 'week':
      case 'month':
        return { icon: CalendarIcon, text: 'Per Hari', description: 'Tren harian' };
      case 'quarter':
      case 'year':
        return { icon: TrendingUp, text: 'Per Bulan', description: 'Evaluasi bulanan' };
      case 'custom':
        return { icon: CalendarIcon, text: 'Custom', description: 'Rentang yang dipilih' };
      default:
        return { icon: CalendarIcon, text: 'Per Hari', description: 'Format default' };
    }
  };

  const displayInfo = getDisplayFormat();
  const IconComponent = displayInfo.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Periode Analisis</label>
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="yesterday">Kemarin</SelectItem>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
                <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
              <IconComponent className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <div className="font-medium text-blue-800">{displayInfo.text}</div>
                <div className="text-xs text-blue-600">{displayInfo.description}</div>
              </div>
            </div>
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Tanggal Mulai</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customStartDate ? format(customStartDate, 'dd/MM/yy', { locale: id }) : 'Pilih'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={onCustomStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Tanggal Akhir</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customEndDate ? format(customEndDate, 'dd/MM/yy', { locale: id }) : 'Pilih'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={onCustomEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDateRangeFilter;
