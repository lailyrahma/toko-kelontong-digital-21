
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image, Check } from 'lucide-react';

interface ProductImageSelectorProps {
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
}

const ProductImageSelector = ({ currentImage, onImageSelect }: ProductImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState(currentImage || '');
  const [isOpen, setIsOpen] = useState(false);

  const presetImages = [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1609501676725-7186f120dc42?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = () => {
    onImageSelect(selectedImage);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Image className="mr-2 h-4 w-4" />
          {currentImage ? 'Ganti Foto' : 'Pilih Foto'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pilih Foto Produk</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">Klik untuk upload foto dari komputer</p>
            </label>
          </div>

          {/* Preset Images */}
          <div>
            <h3 className="text-sm font-medium mb-3">Atau pilih dari galeri:</h3>
            <div className="grid grid-cols-4 gap-3">
              {presetImages.map((imageUrl, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedImage === imageUrl ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden relative">
                      <img 
                        src={imageUrl} 
                        alt={`Preset ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === imageUrl && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleImageSelect} disabled={!selectedImage}>
              Pilih Foto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageSelector;
