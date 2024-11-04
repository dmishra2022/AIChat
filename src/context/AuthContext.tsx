import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setState(prev => ({
        ...prev,
        user: JSON.parse(savedUser),
        loading: false,
      }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (provider: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate OAuth login
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setState(prev => ({ ...prev, user: mockUser, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to login. Please try again.',
        loading: false,
      }));
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      localStorage.removeItem('user');
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to logout. Please try again.',
        loading: false,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}