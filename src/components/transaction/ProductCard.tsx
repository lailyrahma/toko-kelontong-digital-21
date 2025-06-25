
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive" className="stock-empty text-xs">Habis</Badge>;
    if (stock < 10) return <Badge variant="secondary" className="stock-low text-xs">Sedikit</Badge>;
    if (stock <= 50) return <Badge variant="secondary" className="stock-normal text-xs">Normal</Badge>;
    return <Badge variant="secondary" className="stock-abundant text-xs">Banyak</Badge>;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-3 md:p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-2 md:mb-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
          )}
        </div>
        
        <h3 className="font-medium mb-1 line-clamp-2 text-sm md:text-base">{product.name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-2">{product.category}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm md:text-lg">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          {getStockBadge(product.stock)}
        </div>
        <p className="text-xs text-muted-foreground mb-2 md:mb-3 hidden sm:block">
          Stok: {product.stock} | Barcode: {product.barcode}
        </p>
        <p className="text-xs text-muted-foreground mb-2 md:mb-3 sm:hidden">
          Stok: {product.stock}
        </p>
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Tambah</span>
          <span className="sm:hidden">+</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
