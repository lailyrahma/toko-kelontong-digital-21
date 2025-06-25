
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isBundle?: boolean;
  maxQuantity?: number;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    const maxQty = item.maxQuantity || 999;
    if (item.quantity < maxQty) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">{item.name}</h4>
            {item.isBundle ? (
              <p className="text-xs text-muted-foreground">
                Paket bundling
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Maks: {item.maxQuantity || 999} unit
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold text-primary">
              Rp {item.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-muted-foreground">
              Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </span>
          </div>
          
          {/* Enhanced Quantity Controls */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="flex items-center justify-center min-w-[2.5rem] mx-1">
              <span className="text-sm md:text-base font-semibold">
                {item.quantity}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleIncrease}
              disabled={item.quantity >= (item.maxQuantity || 999)}
              className="h-8 w-8 p-0 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Stock Warning */}
        {item.quantity >= (item.maxQuantity || 999) && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Maksimal {item.isBundle ? 'bundling' : 'stok'} tercapai
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartItem;
