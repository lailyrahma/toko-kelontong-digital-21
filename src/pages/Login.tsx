
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, UserCheck } from 'lucide-react';

const Login = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'kasir' | 'pemilik'>('kasir');
  const [loading, setLoading] = useState(false);
  
  // Sign up states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'kasir' | 'pemilik'>('kasir');
  const [signUpLoading, setSignUpLoading] = useState(false);
  
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
          title: "Login Berhasil",
          description: `Selamat datang ${loginRole === 'kasir' ? 'Kasir' : 'Pemilik Toko'}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Login Gagal",
          description: "Email, password, atau role tidak sesuai",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registrasi Berhasil",
        description: `Akun ${signUpRole} berhasil dibuat. Silakan login.`,
      });
      
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpRole('kasir');
      setCurrentView('login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat akun baru",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email Terkirim",
        description: `Link reset password telah dikirim ke ${forgotEmail}`,
      });
      
      setForgotEmail('');
      setCurrentView('login');
    } catch (error) {
      toast({
        title: "Error",
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
          {/* Back Button for Sign Up and Forgot Password */}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to Toko Barokah</h1>
                <p className="text-gray-600">Masuk sesuai dengan role Anda</p>
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
                      placeholder="Password"
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
                    Forgot your password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" 
                  disabled={loading}
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-sm mb-2 text-blue-800">Demo Login:</h4>
                <div className="text-xs space-y-1 text-blue-700">
                  <p><strong>Kasir:</strong> kasir@toko.com / kasir123</p>
                  <p><strong>Pemilik:</strong> pemilik@toko.com / pemilik123</p>
                </div>
              </div>
            </>
          )}

          {/* Sign Up Form */}
          {currentView === 'signup' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Daftar sesuai dengan role yang diinginkan</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="signupRole" className="text-sm font-medium text-gray-700">
                    Daftar Sebagai
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={signUpRole === 'kasir' ? 'default' : 'outline'}
                      onClick={() => setSignUpRole('kasir')}
                      className="flex items-center justify-center p-3 h-auto"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Kasir
                    </Button>
                    <Button
                      type="button"
                      variant={signUpRole === 'pemilik' ? 'default' : 'outline'}
                      onClick={() => setSignUpRole('pemilik')}
                      className="flex items-center justify-center p-3 h-auto"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Pemilik
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="pl-10 h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
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

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" 
                  disabled={signUpLoading}
                >
                  {signUpLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                </Button>
              </form>
            </>
          )}

          {/* Forgot Password Form */}
          {currentView === 'forgot' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-600">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                  {forgotLoading ? 'SENDING...' : 'SEND RESET LINK'}
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
              <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Enter your personal details and start journey with us
              </p>
              <Button
                variant="outline"
                onClick={() => setCurrentView('signup')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-medium"
              >
                SIGN UP
              </Button>
            </>
          )}
          
          {currentView === 'signup' && (
            <>
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-blue-100 mb-8 text-lg">
                To keep connected with us please login with your personal info
              </p>
              <Button
                variant="outline"
                onClick={() => setCurrentView('login')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-medium"
              >
                SIGN IN
              </Button>
            </>
          )}

          {currentView === 'forgot' && (
            <>
              <h2 className="text-4xl font-bold mb-4">Need Help?</h2>
              <p className="text-blue-100 text-lg">
                Don't worry, we'll help you reset your password quickly and securely
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
