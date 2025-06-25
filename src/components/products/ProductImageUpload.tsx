
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, Package, X, FileImage, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  productId: string;
  currentImage?: string;
  category?: string;
  onImageUpdate: (productId: string, imageUrl: string) => void;
}

const ProductImageUpload = ({ productId, currentImage, category = 'general', onImageUpdate }: ProductImageUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Gambar berdasarkan kategori
  const categoryImages = {
    sembako: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop', // Beras
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop', // Gula
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop', // Tepung
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&h=200&fit=crop', // Minyak
    ],
    minuman: [
      'https://images.unsplash.com/photo-1544968503-0773b4000fcc?w=200&h=200&fit=crop', // Air mineral
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop', // Teh
      'https://images.unsplash.com/photo-1571571018784-554b8b2f8b7a?w=200&h=200&fit=crop', // Kopi
      'https://images.unsplash.com/photo-1624552820511-4e9c5ba3c71c?w=200&h=200&fit=crop', // Jus
    ],
    makanan: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop', // Burger
      'https://images.unsplash.com/photo-1563379091339-03246963d51e?w=200&h=200&fit=crop', // Mie instant
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop', // Snack
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop', // Biskuit
    ],
    kebersihan: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop', // Sabun
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', // Detergen
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop', // Shampoo
      'https://images.unsplash.com/photo-1582719471354-c7b3b4c9a5b8?w=200&h=200&fit=crop', // Pasta gigi
    ],
    general: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop',
    ]
  };

  // Semua gambar untuk pencarian
  const allImages = Object.values(categoryImages).flat();

  // Filter gambar berdasarkan pencarian
  const filteredImages = allImages.filter((image, index) => {
    const imageName = `Gambar ${index + 1}`;
    return imageName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getCurrentCategoryImages = () => {
    const categoryKey = category.toLowerCase() as keyof typeof categoryImages;
    return categoryImages[categoryKey] || categoryImages.general;
  };

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

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 5MB",
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
    setIsOpen(false);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Foto Produk</DialogTitle>
          <DialogDescription>
            Pilih foto yang sesuai dengan kategori produk atau upload foto sendiri
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Image Preview */}
          {selectedImage && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Foto yang Dipilih</p>
                    <p className="text-xs text-muted-foreground">Klik "Simpan" untuk menggunakan foto ini</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="category" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="category">Sesuai Kategori</TabsTrigger>
              <TabsTrigger value="all">Semua Gambar</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            {/* Category Images */}
            <TabsContent value="category" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Gambar untuk kategori: <span className="capitalize">{category}</span>
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {getCurrentCategoryImages().map((image, index) => (
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
                            alt={`${category} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* All Images with Search */}
            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari gambar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {(searchQuery ? filteredImages : allImages).map((image, index) => (
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
                          alt={`Gambar ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Upload Section */}
            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Foto Produk</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Drag & drop file gambar atau klik untuk browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Pilih File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Format yang didukung: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
                  <p className="text-xs text-muted-foreground">Gunakan ikon default produk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Batal
          </Button>
          {selectedImage && (
            <Button variant="outline" onClick={handleRemoveImage} className="flex-1 text-red-600">
              Hapus Foto
            </Button>
          )}
          <Button onClick={handleSave} className="flex-1">
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageUpload;
