
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isBundle?: boolean;
}

interface Customer {
  name: string;
  phone: string;
}

interface Receipt {
  id: string;
  date: string;
  time: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  cashierName: string;
}

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}

const ReceiptDialog = ({
  isOpen,
  onClose,
  receipt
}: ReceiptDialogProps) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Struk Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="font-bold">Toko Kelontong Barokah</h3>
            <p className="text-sm text-muted-foreground">
              Jl. Mawar No. 123, Jakarta
            </p>
            <p className="text-sm text-muted-foreground">
              Telp: 021-12345678
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>ID: {receipt.id}</p>
              <p>{receipt.date} {receipt.time}</p>
              <p>Kasir: {receipt.cashierName}</p>
            </div>
          </div>
          
          {receipt.customer && (
            <div className="text-sm border-b pb-2">
              <p><strong>Pelanggan:</strong> {receipt.customer.name}</p>
              {receipt.customer.phone && (
                <p><strong>Telepon:</strong> {receipt.customer.phone}</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            {receipt.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span>{item.name}</span>
                  {item.isBundle && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      Bundling
                    </span>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="font-medium">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rp {receipt.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pajak (10%):</span>
              <span>Rp {receipt.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>Rp {receipt.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Metode:</span>
              <span className="capitalize">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Dibayar:</span>
              <span>Rp {receipt.amountPaid.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Kembalian:</span>
              <span>Rp {receipt.change.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
            <Button onClick={handleFinish} className="flex-1">
              Selesai
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
