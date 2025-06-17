
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan, X, ScanLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  currentBarcode?: string;
}

const BarcodeScanner = ({ onBarcodeScanned, currentBarcode }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState(currentBarcode || '');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsScanning(true);
      
      toast({
        title: "Kamera Aktif",
        description: "Arahkan kamera ke barcode untuk memindai",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Gagal Mengakses Kamera",
        description: "Pastikan browser memiliki izin untuk mengakses kamera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleManualInput = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setIsOpen(false);
      toast({
        title: "Barcode Ditambahkan",
        description: `Barcode ${manualBarcode} berhasil ditambahkan`,
      });
    }
  };

  // Simulasi deteksi barcode (untuk demo)
  const simulateBarcodeDetection = () => {
    const simulatedBarcode = '1234567890' + Math.floor(Math.random() * 1000);
    onBarcodeScanned(simulatedBarcode);
    setIsOpen(false);
    stopCamera();
    toast({
      title: "Barcode Terdeteksi",
      description: `Barcode ${simulatedBarcode} berhasil dipindai`,
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        stopCamera();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Scan className="h-4 w-4 mr-2" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Gunakan kamera untuk memindai barcode atau masukkan manual
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Camera Section */}
          <Card>
            <CardContent className="p-4">
              {!isScanning ? (
                <div className="text-center">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Aktifkan Kamera
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-red-500 border-dashed w-48 h-16 flex items-center justify-center">
                        <ScanLine className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={simulateBarcodeDetection} className="flex-1">
                      Simulasi Scan
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Klik "Simulasi Scan" untuk demo atau arahkan ke barcode
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Input Section */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="manual-barcode">Atau masukkan barcode manual:</Label>
                <Input
                  id="manual-barcode"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Masukkan nomor barcode"
                />
                <Button onClick={handleManualInput} className="w-full" variant="outline">
                  Gunakan Barcode Manual
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
