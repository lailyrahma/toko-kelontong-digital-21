
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  stock: number;
}

interface WhatsAppStockAlertProps {
  lowStockProducts: Product[];
}

const WhatsAppStockAlert = ({ lowStockProducts }: WhatsAppStockAlertProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const generateStockMessage = () => {
    const storeName = "Toko Kelontong Barokah";
    const date = new Date().toLocaleDateString('id-ID');
    const time = new Date().toLocaleTimeString('id-ID');
    
    let message = `🚨 *PERINGATAN STOK MENIPIS* 🚨\n\n`;
    message += `Toko: ${storeName}\n`;
    message += `Tanggal: ${date}\n`;
    message += `Waktu: ${time}\n\n`;
    message += `Produk yang stoknya menipis:\n\n`;
    
    lowStockProducts.forEach((product, index) => {
      const status = product.stock === 0 ? "❌ HABIS" : "⚠️ SEDIKIT";
      message += `${index + 1}. ${product.name}\n`;
      message += `   Status: ${status} (${product.stock} unit)\n\n`;
    });
    
    message += `Mohon segera lakukan restok untuk produk-produk tersebut.\n\n`;
    message += `Terima kasih! 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = async () => {
    if (!phoneNumber) {
      toast({
        title: "Nomor WhatsApp Kosong",
        description: "Masukkan nomor WhatsApp terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const message = generateStockMessage();
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Terbuka",
        description: "Pesan peringatan stok telah disiapkan di WhatsApp",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuka WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
          <MessageCircle className="h-4 w-4 mr-2" />
          Kirim ke WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
            Kirim Peringatan Stok ke WhatsApp
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>{lowStockProducts.length} produk</strong> memiliki stok menipis atau habis
            </p>
            <ul className="text-xs text-yellow-700 mt-2 space-y-1">
              {lowStockProducts.slice(0, 3).map(product => (
                <li key={product.id}>
                  • {product.name} ({product.stock === 0 ? 'Habis' : `${product.stock} unit`})
                </li>
              ))}
              {lowStockProducts.length > 3 && (
                <li>• dan {lowStockProducts.length - 3} produk lainnya</li>
              )}
            </ul>
          </div>
          
          <div>
            <Label htmlFor="phone">Nomor WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Contoh: 628123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: 628xxxxxxxxx (gunakan kode negara tanpa +)
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button 
              onClick={handleSendWhatsApp}
              disabled={isSending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSending ? (
                "Membuka..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Kirim
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppStockAlert;
