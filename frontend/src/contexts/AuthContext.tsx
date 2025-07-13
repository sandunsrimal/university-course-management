'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, AuthContextType } from '@/types/auth';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get('token');
      console.log('🔄 Initializing auth...', {
        hasToken: !!savedToken,
        tokenLength: savedToken?.length
      });
      
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await authAPI.getCurrentUser();
          setUser({
            id: response.id,
            username: response.username,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: response.role,
          });
          console.log('✅ User restored from token:', {
            user: response.username,
            role: response.role
          });
        } catch (error) {
          console.error('❌ Failed to restore user from token:', error);
          Cookies.remove('token');
          setToken(null);
        }
      } else {
        console.log('❌ No saved token found');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: authToken, ...userData } = response;
      
      console.log('✅ Login successful:', {
        user: userData.username,
        role: userData.role,
        tokenLength: authToken?.length
      });
      
      setToken(authToken);
      setUser(userData);
      
      // Save token to cookies
      Cookies.set('token', authToken, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      Cookies.remove('token');
      toast.success('Logged out successfully');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 