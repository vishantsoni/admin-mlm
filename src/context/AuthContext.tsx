"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, rolePermissions, hasPermission as libHasPermission } from '@/lib/auth';


interface AuthContextType {
  user: User | null;
  login: (data: { token: string, user: User }) => void;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  isAuthenticated: boolean;
  role: string | null;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // const initUser = () => {
  //   const token = localStorage.getItem('authToken');
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const user: User = JSON.parse(storedUser);
  //       setUser(user);
  //     } catch {
  //       localStorage.removeItem('user');
  //     }
  //   }
  //   else if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       return {
  //         id: payload.id || payload.sub || '',
  //         phone: payload.phone || '',
  //         username: payload.username || '',
  //         role: payload.role || '',
  //       } as User;
  //     } catch {
  //       localStorage.removeItem('authToken');
  //     }
  //   }
  //   return null;
  // };

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use useEffect to handle localStorage safely on the client side
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setUser(user);
      } catch {
        localStorage.removeItem('user');
      }
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.id || payload.sub || '',
          phone: payload.phone || '',
          username: payload.username || '',
          role: payload.role || '',
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch {
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: { token: string, user: User }) => {
    const { token, user } = data;
    // Set cookie for server-side middleware
    document.cookie = `authToken=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=strict`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const role = user?.role || null;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return libHasPermission(user.role, permission);
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user, 
      login, 
      logout, 
      updateUserProfile,
      isAuthenticated, 
      role, 
      hasPermission,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );

}

