
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, MapPin, Phone, Mail, Clock, Users, Package } from 'lucide-react';

interface StoreProfileProps {
  isEditable?: boolean;
}

const StoreProfile = ({ isEditable = false }: StoreProfileProps) => {
  const storeData = {
    name: "Toko Kelontong Makmur",
    address: "Jl. Raya Kebon Jeruk No. 123, Jakarta Barat 11530",
    phone: "(021) 5555-1234",
    email: "info@tokomakmur.com",
    operatingHours: "06:00 - 22:00 WIB",
    establishedYear: "2018",
    employeeCount: 5,
    productCategories: 8,
    ownerName: "Budi Santoso",
    businessType: "Toko Kelontong",
    taxNumber: "12.345.678.9-123.000"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Profil Toko</h3>
          <p className="text-sm text-muted-foreground">
            {isEditable ? "Kelola informasi toko Anda" : "Informasi toko (hanya bisa dilihat)"}
          </p>
        </div>
        {!isEditable && (
          <Badge variant="secondary" className="bg-gray-100">
            <Users className="h-3 w-3 mr-1" />
            Akses Kasir
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-blue-600" />
              <span>Informasi Dasar</span>
            </CardTitle>
            <CardDescription>Detail utama toko</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama Toko</label>
              <p className="text-base font-medium">{storeData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pemilik</label>
              <p className="text-base">{storeData.ownerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Jenis Usaha</label>
              <p className="text-base">{storeData.businessType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tahun Berdiri</label>
              <p className="text-base">{storeData.establishedYear}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">NPWP</label>
              <p className="text-base font-mono">{storeData.taxNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-600" />
              <span>Informasi Kontak</span>
            </CardTitle>
            <CardDescription>Detail kontak dan lokasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Alamat
              </label>
              <p className="text-base">{storeData.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Telepon
              </label>
              <p className="text-base">{storeData.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <p className="text-base">{storeData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Jam Operasional
              </label>
              <p className="text-base">{storeData.operatingHours}</p>
            </div>
          </CardContent>
        </Card>

        {/* Business Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span>Statistik Bisnis</span>
            </CardTitle>
            <CardDescription>Ringkasan operasional toko</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{storeData.employeeCount}</p>
                <p className="text-sm text-muted-foreground">Karyawan</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{storeData.productCategories}</p>
                <p className="text-sm text-muted-foreground">Kategori Produk</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Store className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {new Date().getFullYear() - parseInt(storeData.establishedYear)}
                </p>
                <p className="text-sm text-muted-foreground">Tahun Beroperasi</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">16</p>
                <p className="text-sm text-muted-foreground">Jam/Hari</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isEditable && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Akses Kasir</p>
                <p className="text-xs text-amber-700">
                  Anda masuk sebagai kasir. Informasi profil toko hanya dapat dilihat, tidak dapat diedit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreProfile;
