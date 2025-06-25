
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
        <Badge variant="secondary" className="text-xs">Tersedia</Badge> : 
        <Badge variant="destructive" className="text-xs">Tidak Tersedia</Badge>;
    }
    
    if (product) {
      const stock = product.stock;
      if (stock === 0) return <Badge variant="destructive" className="stock-empty text-xs">Habis</Badge>;
      if (stock < 10) return <Badge variant="secondary" className="stock-low text-xs">Sedikit</Badge>;
      if (stock <= 50) return <Badge variant="secondary" className="stock-normal text-xs">Normal</Badge>;
      return <Badge variant="secondary" className="stock-abundant text-xs">Banyak</Badge>;
    }
    
    return null;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-3 md:p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-2 md:mb-3 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium line-clamp-2 text-sm md:text-base flex-1">{item.name}</h3>
          {isBundle && (
            <Badge variant="outline" className="ml-2 text-xs">
              Bundling
            </Badge>
          )}
        </div>
        
        {!isBundle && product && (
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{product.category}</p>
        )}
        
        {isBundle && bundle && (
          <p className="text-xs text-muted-foreground mb-2">
            {bundle.products.length} produk dalam paket
          </p>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm md:text-lg">
            Rp {item.price.toLocaleString('id-ID')}
          </span>
          {getStockBadge()}
        </div>
        
        {!isBundle && product && (
          <>
            <p className="text-xs text-muted-foreground mb-2 md:mb-3 hidden sm:block">
              Stok: {product.stock} | Barcode: {product.barcode}
            </p>
            <p className="text-xs text-muted-foreground mb-2 md:mb-3 sm:hidden">
              Stok: {product.stock}
            </p>
          </>
        )}
        
        {isBundle && bundle && (
          <p className="text-xs text-muted-foreground mb-2 md:mb-3">
            {bundle.products.map(p => `${p.productName} (${p.quantity}x)`).join(', ')}
          </p>
        )}
        
        <Button 
          onClick={() => onAddToCart(item)}
          disabled={!isAvailable}
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
