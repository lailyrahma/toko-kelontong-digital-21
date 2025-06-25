import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  isBundle?: boolean;
  bundleItems?: { productName: string; quantity: number }[];
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOutOfStock ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="aspect-square bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              product.isBundle ? (
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )
            )}
          </div>
          <div className="flex flex-col space-y-1">
            {product.isBundle && (
              <Badge variant="secondary" className="text-xs">
                Bundling
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Stok Sedikit
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Habis
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          
          {product.isBundle && product.bundleItems && (
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p className="font-medium mb-1">Isi Bundling:</p>
              {product.bundleItems.map((item, index) => (
                <p key={index} className="text-gray-600">
                  • {item.productName} x {item.quantity}
                </p>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">{product.category}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-primary">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-muted-foreground">
                Stok: {product.stock}
              </p>
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
