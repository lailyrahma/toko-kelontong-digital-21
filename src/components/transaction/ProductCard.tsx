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

interface Bundle {
  id: string;
  name: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  price: number;
  image?: string;
  isAvailable: boolean;
}

interface ProductCardProps {
  product?: Product;
  bundle?: Bundle;
  onAddToCart: (item: Product | Bundle) => void;
}

const ProductCard = ({ product, bundle, onAddToCart }: ProductCardProps) => {
  const item = product || bundle;
  if (!item) return null;

  const isBundle = !!bundle;
  const isAvailable = product ? product.stock > 0 : bundle?.isAvailable || false;

  const getStockBadge = () => {
    if (isBundle) {
      return bundle?.isAvailable ? 
        <Badge variant="secondary" className="text-[10px] px-1 py-0">Tersedia</Badge> : 
        <Badge variant="destructive" className="text-[10px] px-1 py-0">Tidak Tersedia</Badge>;
    }
    
    if (product) {
      const stock = product.stock;
      if (stock === 0) return <Badge variant="destructive" className="stock-empty text-[10px] px-1 py-0">Habis</Badge>;
      if (stock < 10) return <Badge variant="secondary" className="stock-low text-[10px] px-1 py-0">Sedikit</Badge>;
      if (stock <= 50) return <Badge variant="secondary" className="stock-normal text-[10px] px-1 py-0">Normal</Badge>;
      return <Badge variant="secondary" className="stock-abundant text-[10px] px-1 py-0">Banyak</Badge>;
    }
    
    return null;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-2 sm:p-3 h-full flex flex-col">
        <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex items-start justify-between mb-1 sm:mb-2 min-h-[2.5rem]">
          <h3 className="font-medium line-clamp-2 text-xs sm:text-sm flex-1 leading-tight">{item.name}</h3>
          {isBundle && (
            <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 flex-shrink-0">
              Bundle
            </Badge>
          )}
        </div>
        
        {!isBundle && product && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">{product.category}</p>
        )}
        
        {isBundle && bundle && (
          <p className="text-[10px] text-muted-foreground mb-1">
            {bundle.products.length} produk
          </p>
        )}
        
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <span className="font-bold text-xs sm:text-sm">
            Rp {item.price.toLocaleString('id-ID')}
          </span>
          {getStockBadge()}
        </div>
        
        {!isBundle && product && (
          <p className="text-[10px] text-muted-foreground mb-2 hidden sm:block">
            Stok: {product.stock}
          </p>
        )}
        
        {isBundle && bundle && (
          <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
            {bundle.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}
          </p>
        )}
        
        <Button 
          onClick={() => onAddToCart(item)}
          disabled={!isAvailable}
          className="w-full mt-auto h-7 sm:h-8 text-[10px] sm:text-xs"
          size="sm"
        >
          <Plus className="mr-1 h-3 w-3" />
          <span className="hidden xs:inline">Tambah</span>
          <span className="xs:hidden">+</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
