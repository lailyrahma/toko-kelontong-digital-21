
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface CashierAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const CashierManagement = () => {
  const [cashiers, setCashiers] = useState<CashierAccount[]>([
    {
      id: '1',
      name: 'Ahmad Kasir',
      email: 'kasir@toko.com',
      phone: '081234567890',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20 09:30'
    },
    {
      id: '2',
      name: 'Siti Kasir',
      email: 'siti.kasir@toko.com',
      phone: '081234567891',
      status: 'active',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-19 14:20'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<CashierAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setEditingCashier(null);
    setShowPassword(false);
  };

  const handleAddCashier = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditCashier = (cashier: CashierAccount) => {
    setEditingCashier(cashier);
    setFormData({
      name: cashier.name,
      email: cashier.email,
      phone: cashier.phone,
      password: '',
      confirmPassword: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Kesalahan",
          description: "Semua field wajib diisi",
          variant: "destructive",
        });
        return;
      }

      if (!editingCashier && (!formData.password || !formData.confirmPassword)) {
        toast({
          title: "Kesalahan",
          description: "Kata sandi harus diisi untuk akun baru",
          variant: "destructive",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Kesalahan",
          description: "Konfirmasi kata sandi tidak cocok",
          variant: "destructive",
        });
        return;
      }

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingCashier) {
        // Update existing cashier
        setCashiers(prev => prev.map(cashier => 
          cashier.id === editingCashier.id 
            ? { ...cashier, name: formData.name, email: formData.email, phone: formData.phone }
            : cashier
        ));
        toast({
          title: "Berhasil",
          description: "Data kasir berhasil diperbarui",
        });
      } else {
        // Add new cashier
        const newCashier: CashierAccount = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setCashiers(prev => [...prev, newCashier]);
        toast({
          title: "Berhasil",
          description: "Akun kasir baru berhasil dibuat",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCashier = async (cashierId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun kasir ini?')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCashiers(prev => prev.filter(cashier => cashier.id !== cashierId));
      toast({
        title: "Berhasil",
        description: "Akun kasir berhasil dihapus",
      });
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus akun kasir",
        variant: "destructive",
      });
    }
  };

  const toggleCashierStatus = async (cashierId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCashiers(prev => prev.map(cashier => 
        cashier.id === cashierId 
          ? { ...cashier, status: cashier.status === 'active' ? 'inactive' : 'active' }
          : cashier
      ));
      toast({
        title: "Berhasil",
        description: "Status kasir berhasil diperbarui",
      });
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui status kasir",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Manajemen Akun Kasir</span>
              </CardTitle>
              <CardDescription>
                Kelola akun kasir yang dapat mengakses sistem POS
              </CardDescription>
            </div>
            <Button onClick={handleAddCashier}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kasir
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Login Terakhir</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashiers.map((cashier) => (
                  <TableRow key={cashier.id}>
                    <TableCell className="font-medium">{cashier.name}</TableCell>
                    <TableCell>{cashier.email}</TableCell>
                    <TableCell>{cashier.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={cashier.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleCashierStatus(cashier.id)}
                      >
                        {cashier.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{cashier.createdAt}</TableCell>
                    <TableCell>{cashier.lastLogin || 'Belum pernah'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCashier(cashier)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCashier(cashier.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Cashier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCashier ? 'Edit Akun Kasir' : 'Tambah Akun Kasir Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingCashier 
                ? 'Perbarui informasi akun kasir' 
                : 'Buat akun kasir baru untuk mengakses sistem POS'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Masukkan nomor telepon"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingCashier ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required={!editingCashier}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Konfirmasi kata sandi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10"
                  required={!editingCashier}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Menyimpan...' : (editingCashier ? 'Perbarui' : 'Tambah')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashierManagement;
