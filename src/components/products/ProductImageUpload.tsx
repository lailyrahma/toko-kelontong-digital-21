
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Package, X, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  productId: string;
  currentImage?: string;
  onImageUpdate: (productId: string, imageUrl: string) => void;
}

const ProductImageUpload = ({ productId, currentImage, onImageUpdate }: ProductImageUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Placeholder images untuk demo
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop',
  ];

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "File Tidak Valid",
          description: "Harap pilih file gambar (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 2MB",
          variant: "destructive",
        });
        return;
      }

      // Buat URL untuk preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onImageUpdate(productId, selectedImage);
      setIsOpen(false);
      toast({
        title: "Foto Produk Diperbarui",
        description: "Foto produk berhasil disimpan",
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageUpdate(productId, '');
    toast({
      title: "Foto Produk Dihapus",
      description: "Foto produk berhasil dihapus",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Camera className="h-3 w-3 mr-1" />
          {currentImage ? 'Ubah Foto' : 'Tambah Foto'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Kelola Foto Produk</DialogTitle>
          <DialogDescription>
            Pilih atau upload foto untuk produk ini
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Image Preview */}
          {selectedImage && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Foto Saat Ini</p>
                    <p className="text-xs text-muted-foreground">Klik simpan untuk menggunakan foto ini</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Section */}
          <Card>
            <CardContent className="p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload foto produk</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Pilih File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: JPG, PNG (Max 2MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder Images */}
          <div>
            <h4 className="text-sm font-medium mb-3">Atau pilih dari galeri:</h4>
            <div className="grid grid-cols-4 gap-2">
              {placeholderImages.map((image, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* No Image Option */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedImage === null ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedImage(null)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Tanpa Foto</p>
                  <p className="text-xs text-muted-foreground">Gunakan icon default</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Batal
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageUpload;
