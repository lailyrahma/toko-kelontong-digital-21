
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, UserCheck } from 'lucide-react';

const Login = () => {
  const [currentView, setCurrentView] = useState<'login' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'kasir' | 'pemilik'>('kasir');
  const [loading, setLoading] = useState(false);
  
  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, loginRole);
      if (success) {
        toast({
          title: "Berhasil Masuk",
          description: `Selamat datang ${loginRole === 'kasir' ? 'Kasir' : 'Pemilik Toko'}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Gagal Masuk",
          description: "Email, kata sandi, atau peran tidak sesuai",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat masuk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email Terkirim",
        description: `Tautan reset kata sandi telah dikirim ke ${forgotEmail}`,
      });
      
      setForgotEmail('');
      setCurrentView('login');
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal mengirim email reset",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button for Forgot Password */}
          {currentView !== 'login' && (
            <Button
              variant="ghost"
              onClick={() => setCurrentView('login')}
              className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          )}

          {/* Login Form */}
          {currentView === 'login' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Toko Barokah</h1>
                <p className="text-gray-600">Masuk sesuai dengan peran Anda</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Masuk Sebagai
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={loginRole === 'kasir' ? 'default' : 'outline'}
                      onClick={() => setLoginRole('kasir')}
                      className="flex items-center justify-center p-3 h-auto"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Kasir
                    </Button>
                    <Button
                      type="button"
                      variant={loginRole === 'pemilik' ? 'default' : 'outline'}
                      onClick={() => setLoginRole('pemilik')}
                      className="flex items-center justify-center p-3 h-auto"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Pemilik
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Kata Sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-300 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setCurrentView('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" 
                  disabled={loading}
                >
                  {loading ? 'MEMPROSES...' : 'MASUK'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-sm mb-2 text-blue-800">Akun Demo:</h4>
                <div className="text-xs space-y-1 text-blue-700">
                  <p><strong>Kasir:</strong> kasir@toko.com / kasir123</p>
                  <p><strong>Pemilik:</strong> pemilik@toko.com / pemilik123</p>
                </div>
              </div>

              {/* Owner Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 text-center">
                  <strong>Pemilik:</strong> Kelola akun kasir di menu Profil setelah masuk
                </p>
              </div>
            </>
          )}

          {/* Forgot Password Form */}
          {currentView === 'forgot' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Kata Sandi</h1>
                <p className="text-gray-600">Masukkan email Anda untuk menerima instruksi reset</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" 
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'MENGIRIM...' : 'KIRIM TAUTAN RESET'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Welcome Message */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          {currentView === 'login' && (
            <>
              <h2 className="text-4xl font-bold mb-4">Selamat Datang!</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Masuk ke sistem pengelolaan toko Anda dengan mudah dan aman
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm">
                <p className="mb-2">Fitur untuk Pemilik:</p>
                <ul className="text-xs space-y-1 text-left">
                  <li>• Kelola semua data toko</li>
                  <li>• Analisis penjualan mendalam</li>
                  <li>• Manajemen akun kasir</li>
                  <li>• Laporan keuangan lengkap</li>
                </ul>
              </div>
            </>
          )}

          {currentView === 'forgot' && (
            <>
              <h2 className="text-4xl font-bold mb-4">Butuh Bantuan?</h2>
              <p className="text-blue-100 text-lg">
                Jangan khawatir, kami akan membantu Anda mereset kata sandi dengan cepat dan aman
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
