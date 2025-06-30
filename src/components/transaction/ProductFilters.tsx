
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Category {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProductFilters = ({ 
  searchTerm, 
  selectedCategory, 
  categories, 
  onSearchChange, 
  onCategoryChange 
}: ProductFiltersProps) => {
  return (
    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari produk atau scan barcode..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Pilih kategori" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductFilters;
