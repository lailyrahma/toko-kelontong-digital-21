
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { User, Store, Phone, Mail, MapPin, Save } from 'lucide-react';
import CashierManagement from '@/components/cashier/CashierManagement';

const Profile = () => {
  const { user, store, updateUser, updateStore } = useUser();
  const { toast } = useToast();
  
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [storeForm, setStoreForm] = useState({
    name: store.name,
    address: store.address,
    phone: store.phone,
    email: store.email
  });

  const [loading, setLoading] = useState(false);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(userForm);
      toast({
        title: "Berhasil",
        description: "Profil pengguna berhasil diperbarui",
      });
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui profil pengguna",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStore(storeForm);
      toast({
        title: "Berhasil",
        description: "Informasi toko berhasil diperbarui",
      });
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui informasi toko",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Profil & Pengaturan</h1>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil Saya</TabsTrigger>
              <TabsTrigger value="store">Informasi Toko</TabsTrigger>
              {user?.role === 'pemilik' && (
                <TabsTrigger value="cashiers">Manajemen Kasir</TabsTrigger>
              )}
            </TabsList>

            {/* User Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profil Pengguna</span>
                  </CardTitle>
                  <CardDescription>
                    Kelola informasi profil pribadi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUserSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nama Lengkap</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="userName"
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="userEmail"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userPhone">Nomor Telepon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="userPhone"
                            type="tel"
                            value={userForm.phone}
                            onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan nomor telepon"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userRole">Peran</Label>
                        <Input
                          id="userRole"
                          type="text"
                          value={user?.role === 'kasir' ? 'Kasir' : 'Pemilik'}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userAddress">Alamat</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          id="userAddress"
                          value={userForm.address}
                          onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Masukkan alamat lengkap"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Store Information Tab */}
            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Informasi Toko</span>
                  </CardTitle>
                  <CardDescription>
                    Kelola informasi dasar toko Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStoreSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Nama Toko</Label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="storeName"
                            type="text"
                            value={storeForm.name}
                            onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan nama toko"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storeEmail">Email Toko</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="storeEmail"
                            type="email"
                            value={storeForm.email}
                            onChange={(e) => setStoreForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan email toko"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storePhone">Nomor Telepon Toko</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="storePhone"
                            type="tel"
                            value={storeForm.phone}
                            onChange={(e) => setStoreForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10"
                            placeholder="Masukkan nomor telepon toko"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeAddress">Alamat Toko</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          id="storeAddress"
                          value={storeForm.address}
                          onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Masukkan alamat toko lengkap"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cashier Management Tab - Only for Owner */}
            {user?.role === 'pemilik' && (
              <TabsContent value="cashiers">
                <CashierManagement />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Profile;
