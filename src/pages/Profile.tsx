
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Store, Lock, HelpCircle, LogOut, Phone, Mail, MapPin, Edit, AlertTriangle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, store, updateUser, updateStore, logout } = useUser();
  const isOwner = user?.role === 'pemilik';
  
  const [editingUser, setEditingUser] = useState(false);
  const [editingStore, setEditingStore] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [storeForm, setStoreForm] = useState({
    name: store.name,
    address: store.address,
    phone: store.phone,
    email: store.email,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserUpdate = () => {
    updateUser(userForm);
    setEditingUser(false);
    toast({
      title: "Profil Diperbarui",
      description: "Data profil Anda berhasil diperbarui",
    });
  };

  const handleStoreUpdate = () => {
    if (!isOwner) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya pemilik yang dapat mengedit profil toko",
        variant: "destructive",
      });
      return;
    }
    
    updateStore(storeForm);
    setEditingStore(false);
    toast({
      title: "Profil Toko Diperbarui",
      description: "Data toko berhasil diperbarui",
    });
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Password baru dan konfirmasi password tidak sama",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    // Simulasi change password
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast({
      title: "Password Diubah",
      description: "Password Anda berhasil diubah",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const handleStoreEditClick = () => {
    if (!isOwner) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya pemilik yang dapat mengedit profil toko",
        variant: "destructive",
      });
      return;
    }
    setEditingStore(!editingStore);
  };

  const helpTopics = [
    {
      title: "Cara menggunakan fitur scan barcode",
      description: "Panduan lengkap menggunakan scanner barcode untuk input produk"
    },
    {
      title: "Cara mengelola stok produk",
      description: "Tutorial menambah, mengedit, dan memantau stok produk"
    },
    {
      title: "Cara mencetak struk pembayaran",
      description: "Panduan mencetak dan mengelola struk transaksi"
    },
    {
      title: "Cara membaca laporan analytics",
      description: "Memahami data penjualan dan insight bisnis"
    },
    {
      title: "Troubleshooting masalah umum",
      description: "Solusi untuk masalah yang sering terjadi"
    }
  ];

  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Profil & Pengaturan</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="user" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="user" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profil Pengguna</span>
                </TabsTrigger>
                <TabsTrigger value="store" className="flex items-center space-x-2">
                  <Store className="h-4 w-4" />
                  <span>Profil Toko</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Keamanan</span>
                </TabsTrigger>
                <TabsTrigger value="help" className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Bantuan</span>
                </TabsTrigger>
              </TabsList>

              {/* User Profile Tab */}
              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil Pengguna</CardTitle>
                    <CardDescription>
                      Kelola informasi personal Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {user?.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{user?.name}</h3>
                        <p className="text-muted-foreground capitalize">{user?.role}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(!editingUser)}
                          className="mt-2"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {editingUser ? 'Batal' : 'Edit Profil'}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nama Lengkap</Label>
                          {editingUser ? (
                            <Input
                              id="name"
                              value={userForm.name}
                              onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{user?.name}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          {editingUser ? (
                            <Input
                              id="email"
                              type="email"
                              value={userForm.email}
                              onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{user?.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone">Nomor Telepon</Label>
                          {editingUser ? (
                            <Input
                              id="phone"
                              value={userForm.phone}
                              onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{user?.phone}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="address">Alamat</Label>
                          {editingUser ? (
                            <Input
                              id="address"
                              value={userForm.address}
                              onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{user?.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {editingUser && (
                      <div className="flex space-x-4">
                        <Button onClick={handleUserUpdate}>
                          Simpan Perubahan
                        </Button>
                        <Button variant="outline" onClick={() => setEditingUser(false)}>
                          Batal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Store Profile Tab */}
              <TabsContent value="store">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil Toko</CardTitle>
                    <CardDescription>
                      Kelola informasi toko Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Access Control Notice for Store Profile */}
                    {!isOwner && (
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 text-yellow-800">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-sm">
                              <strong>Info:</strong> Hanya pemilik yang dapat mengedit profil toko. Anda hanya dapat melihat informasi toko.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">TB</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{store.name}</h3>
                        <p className="text-muted-foreground">Point of Sale System</p>
                        {isOwner && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleStoreEditClick}
                            className="mt-2"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {editingStore ? 'Batal' : 'Edit Toko'}
                          </Button>
                        )}
                        {!isOwner && (
                          <div className="mt-2 text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded inline-block">
                            View Only
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="store-name">Nama Toko</Label>
                          {editingStore && isOwner ? (
                            <Input
                              id="store-name"
                              value={storeForm.name}
                              onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <Store className="h-4 w-4 text-muted-foreground" />
                              <span>{store.name}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="store-email">Email Toko</Label>
                          {editingStore && isOwner ? (
                            <Input
                              id="store-email"
                              type="email"
                              value={storeForm.email}
                              onChange={(e) => setStoreForm({...storeForm, email: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{store.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="store-phone">Telepon Toko</Label>
                          {editingStore && isOwner ? (
                            <Input
                              id="store-phone"
                              value={storeForm.phone}
                              onChange={(e) => setStoreForm({...storeForm, phone: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{store.phone}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="store-address">Alamat Toko</Label>
                          {editingStore && isOwner ? (
                            <Input
                              id="store-address"
                              value={storeForm.address}
                              onChange={(e) => setStoreForm({...storeForm, address: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{store.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {editingStore && isOwner && (
                      <div className="flex space-x-4">
                        <Button onClick={handleStoreUpdate}>
                          Simpan Perubahan
                        </Button>
                        <Button variant="outline" onClick={() => setEditingStore(false)}>
                          Batal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Keamanan Akun</CardTitle>
                    <CardDescription>
                      Kelola password dan pengaturan keamanan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Lock className="mr-2 h-4 w-4" />
                            Ubah Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ubah Password</DialogTitle>
                            <DialogDescription>
                              Masukkan password lama dan password baru
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="current-password">Password Saat Ini</Label>
                              <Input
                                id="current-password"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-password">Password Baru</Label>
                              <Input
                                id="new-password"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              />
                            </div>
                            <Button onClick={handlePasswordChange} className="w-full">
                              Ubah Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Separator />

                      <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar dari Akun
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Help Tab */}
              <TabsContent value="help">
                <Card>
                  <CardHeader>
                    <CardTitle>Bantuan & Dukungan</CardTitle>
                    <CardDescription>
                      Temukan bantuan dan tutorial penggunaan sistem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {helpTopics.map((topic, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">{topic.title}</h4>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Butuh bantuan lebih lanjut?
                      </p>
                      <Button variant="outline">
                        Hubungi Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
