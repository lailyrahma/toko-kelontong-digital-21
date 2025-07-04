
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Pencil, Trash2, UserCheck, UserX, Mail, Phone, MapPin, User } from 'lucide-react';

interface Cashier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

const CashierManagement = () => {
  const [cashiers, setCashiers] = useState<Cashier[]>([
    {
      id: '1',
      name: 'Ahmad Suwandi',
      email: 'ahmad@example.com',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 123, Jakarta',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '081234567891',
      address: 'Jl. Sudirman No. 456, Jakarta',
      isActive: true,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567892',
      address: 'Jl. Thamrin No. 789, Jakarta',
      isActive: false,
      createdAt: '2024-01-20'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [newCashier, setNewCashier] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const { toast } = useToast();

  const handleAddCashier = () => {
    if (!newCashier.name || !newCashier.email || !newCashier.phone) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi semua field yang wajib",
        variant: "destructive",
      });
      return;
    }

    const cashier: Cashier = {
      ...newCashier,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCashiers([...cashiers, cashier]);
    setNewCashier({ name: '', email: '', phone: '', address: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Kasir Ditambahkan",
      description: `${cashier.name} berhasil ditambahkan sebagai kasir`,
    });
  };

  const handleEditCashier = () => {
    if (!editingCashier) return;

    setCashiers(cashiers.map(c => 
      c.id === editingCashier.id ? editingCashier : c
    ));
    
    setEditingCashier(null);
    setShowEditDialog(false);
    
    toast({
      title: "Data Kasir Diperbarui",
      description: "Informasi kasir berhasil diperbarui",
    });
  };

  const handleDeleteCashier = (cashierId: string) => {
    const cashier = cashiers.find(c => c.id === cashierId);
    setCashiers(cashiers.filter(c => c.id !== cashierId));
    
    toast({
      title: "Kasir Dihapus",
      description: `${cashier?.name} telah dihapus dari sistem`,
    });
  };

  const toggleCashierStatus = (cashierId: string) => {
    setCashiers(cashiers.map(c => 
      c.id === cashierId ? { ...c, isActive: !c.isActive } : c
    ));
    
    const cashier = cashiers.find(c => c.id === cashierId);
    toast({
      title: "Status Diperbarui",
      description: `${cashier?.name} ${cashier?.isActive ? 'dinonaktifkan' : 'diaktifkan'}`,
    });
  };

  const startEdit = (cashier: Cashier) => {
    setEditingCashier({ ...cashier });
    setShowEditDialog(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Manajemen Kasir</span>
            </CardTitle>
            <CardDescription>
              Kelola akun kasir yang dapat mengakses sistem
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kasir
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Tambah Kasir Baru</DialogTitle>
                <DialogDescription>
                  Buat akun kasir baru untuk sistem POS
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-cashier-name">Nama Lengkap *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-cashier-name"
                      value={newCashier.name}
                      onChange={(e) => setNewCashier(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-cashier-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-cashier-email"
                      type="email"
                      value={newCashier.email}
                      onChange={(e) => setNewCashier(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-cashier-phone">Nomor Telepon *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-cashier-phone"
                      type="tel"
                      value={newCashier.phone}
                      onChange={(e) => setNewCashier(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-cashier-address">Alamat</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="new-cashier-address"
                      value={newCashier.address}
                      onChange={(e) => setNewCashier(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button onClick={handleAddCashier} className="flex-1">
                    Tambah Kasir
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cashiers.map((cashier) => (
            <Card key={cashier.id} className={`${!cashier.isActive ? 'opacity-75' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <h3 className="font-medium text-lg">{cashier.name}</h3>
                      <Badge 
                        variant={cashier.isActive ? 'secondary' : 'destructive'}
                        className="w-fit"
                      >
                        {cashier.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="break-all">{cashier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{cashier.phone}</span>
                      </div>
                      {cashier.address && (
                        <div className="flex items-start space-x-2 sm:col-span-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span className="break-words">{cashier.address}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Bergabung: {new Date(cashier.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCashierStatus(cashier.id)}
                      className="flex-1 sm:flex-none"
                    >
                      {cashier.isActive ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Nonaktifkan
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Aktifkan
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(cashier)}
                      className="flex-1 sm:flex-none"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCashier(cashier.id)}
                      className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {cashiers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Belum ada kasir yang terdaftar</p>
              <p className="text-sm text-muted-foreground">Klik "Tambah Kasir" untuk menambahkan kasir pertama</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Cashier Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-full max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Kasir</DialogTitle>
            <DialogDescription>
              Perbarui informasi kasir
            </DialogDescription>
          </DialogHeader>
          {editingCashier && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cashier-name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="edit-cashier-name"
                    value={editingCashier.name}
                    onChange={(e) => setEditingCashier({...editingCashier, name: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cashier-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="edit-cashier-email"
                    type="email"
                    value={editingCashier.email}
                    onChange={(e) => setEditingCashier({...editingCashier, email: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cashier-phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="edit-cashier-phone"
                    type="tel"
                    value={editingCashier.phone}
                    onChange={(e) => setEditingCashier({...editingCashier, phone: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cashier-address">Alamat</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="edit-cashier-address"
                    value={editingCashier.address}
                    onChange={(e) => setEditingCashier({...editingCashier, address: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                  Batal
                </Button>
                <Button onClick={handleEditCashier} className="flex-1">
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CashierManagement;
