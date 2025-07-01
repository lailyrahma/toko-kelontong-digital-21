
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Calendar, Shield, Store } from 'lucide-react';
import StoreProfile from '@/components/profile/StoreProfile';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Kasir Utama',
    email: 'kasir@tokomakmur.com',
    phone: '081234567890',
    role: 'cashier',
    joinDate: '2023-01-15',
    avatar: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profil Pengguna</TabsTrigger>
              <TabsTrigger value="store">Profil Toko</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informasi Pengguna</CardTitle>
                      <CardDescription>Kelola informasi akun Anda</CardDescription>
                    </div>
                    <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                      {userProfile.role === 'admin' ? 'Administrator' : 'Kasir'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback className="text-2xl">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                              <Input
                                id="name"
                                value={userProfile.name}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                              />
                            ) : (
                              <span className="text-base">{userProfile.name}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                              <Input
                                id="email"
                                type="email"
                                value={userProfile.email}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                              />
                            ) : (
                              <span className="text-base">{userProfile.email}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Nomor Telepon</Label>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {isEditing ? (
                              <Input
                                id="phone"
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                              />
                            ) : (
                              <span className="text-base">{userProfile.phone}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Bergabung Sejak</Label>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-base">
                              {new Date(userProfile.joinDate).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {isEditing ? (
                          <>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                              Simpan Perubahan
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Batal
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setIsEditing(true)} variant="outline">
                            Edit Profil
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Informasi Akses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role Pengguna:</span>
                      <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                        {userProfile.role === 'admin' ? 'Administrator' : 'Kasir'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userProfile.role === 'admin' 
                        ? 'Anda memiliki akses penuh ke semua fitur sistem.'
                        : 'Anda memiliki akses untuk melakukan transaksi dan melihat informasi toko.'
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="store">
              <StoreProfile isEditable={userProfile.role === 'admin'} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Profile;
