
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DateRangeFilterProps {
  dateRange: string;
  selectedDate: Date | undefined;
  customDateRange?: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  onDateRangeChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onCustomDateRangeChange?: (range: { startDate: Date | undefined; endDate: Date | undefined }) => void;
}

const DateRangeFilter = ({ 
  dateRange, 
  selectedDate,
  customDateRange,
  onDateRangeChange, 
  onDateChange,
  onCustomDateRangeChange
}: DateRangeFilterProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Periode Analisis</label>
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini (Per Jam)</SelectItem>
                <SelectItem value="yesterday">Kemarin (Per Jam)</SelectItem>
                <SelectItem value="week">7 Hari Terakhir (Per Hari)</SelectItem>
                <SelectItem value="month">30 Hari Terakhir (Per Tanggal)</SelectItem>
                <SelectItem value="quarter">3 Bulan Terakhir (Per Bulan)</SelectItem>
                <SelectItem value="year">Tahun Ini (Per Bulan)</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Mulai</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange?.startDate ? format(customDateRange.startDate, 'dd/MM/yyyy', { locale: id }) : 'Pilih'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDateRange?.startDate}
                      onSelect={(date) => onCustomDateRangeChange?.({ 
                        startDate: date, 
                        endDate: customDateRange?.endDate 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Akhir</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange?.endDate ? format(customDateRange.endDate, 'dd/MM/yyyy', { locale: id }) : 'Pilih'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customDateRange?.endDate}
                      onSelect={(date) => onCustomDateRangeChange?.({ 
                        startDate: customDateRange?.startDate, 
                        endDate: date 
                      })}
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

export default DateRangeFilter;
