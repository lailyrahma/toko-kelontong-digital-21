
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentMethod: string, amountPaid: number) => void;
}

const PaymentDialog = ({
  isOpen,
  onClose,
  total,
  onPaymentComplete
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'debit'>('cash');
  const [amountPaid, setAmountPaid] = useState('');

  const handleProcessPayment = () => {
    const paidAmount = paymentMethod === 'cash' ? parseFloat(amountPaid) : total;
    
    if (paymentMethod === 'cash' && (!amountPaid || paidAmount < total)) {
      return;
    }
    
    onPaymentComplete(paymentMethod, paidAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              Total: Rp {total.toLocaleString('id-ID')}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('cash')}
                className="flex flex-col h-16"
              >
                <Banknote className="h-5 w-5 mb-1" />
                Tunai
              </Button>
              <Button
                variant={paymentMethod === 'qris' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('qris')}
                className="flex flex-col h-16"
              >
                <Smartphone className="h-5 w-5 mb-1" />
                QRIS
              </Button>
              <Button
                variant={paymentMethod === 'debit' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('debit')}
                className="flex flex-col h-16"
              >
                <CreditCard className="h-5 w-5 mb-1" />
                Debit
              </Button>
            </div>
          </div>

          {paymentMethod === 'cash' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Jumlah Dibayar</label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
              {amountPaid && parseFloat(amountPaid) >= total && (
                <p className="text-sm text-green-600 mt-2">
                  Kembalian: Rp {(parseFloat(amountPaid) - total).toLocaleString('id-ID')}
                </p>
              )}
            </div>
          )}

          <Button onClick={handleProcessPayment} className="w-full">
            Proses Pembayaran
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
