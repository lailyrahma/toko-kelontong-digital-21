
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'kasir' | 'pemilik';
}

interface Store {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  store: Store;
  login: (email: string, password: string, role: 'kasir' | 'pemilik') => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateStore: (storeData: Partial<Store>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store>({
    name: 'Toko Kelontong Barokah',
    address: 'Jl. Mawar No. 123, Jakarta',
    phone: '021-12345678',
    email: 'tokobarokah@email.com'
  });

  const login = async (email: string, password: string, role: 'kasir' | 'pemilik'): Promise<boolean> => {
    // Simulasi login dengan validasi role
    if (email === 'kasir@toko.com' && password === 'kasir123' && role === 'kasir') {
      setUser({
        id: '1',
        name: 'Ahmad Kasir',
        email: 'kasir@toko.com',
        phone: '081234567890',
        address: 'Jl. Melati No. 45',
        role: 'kasir'
      });
      return true;
    } else if (email === 'pemilik@toko.com' && password === 'pemilik123' && role === 'pemilik') {
      setUser({
        id: '2',
        name: 'Budi Pemilik',
        email: 'pemilik@toko.com',
        phone: '081987654321',
        address: 'Jl. Anggrek No. 78',
        role: 'pemilik'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const updateStore = (storeData: Partial<Store>) => {
    setStore({ ...store, ...storeData });
  };

  return (
    <UserContext.Provider value={{ user, store, login, logout, updateUser, updateStore }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
