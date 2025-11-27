import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAccessToken } from '../lib/api';
import type { IUser } from '../types';

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        const profile = await api.get('/api/user/profile');
        setUser(profile.data.user);
      } catch (error) {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    await api.post('/api/auth/register', { email, password, name, role: 'student' });
    await login(email, password);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
