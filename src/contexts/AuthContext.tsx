
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  timezone?: string;
  jobTitle?: string;
  company?: string;
  socialCareWork?: string[];
  profileCompleted: boolean;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('cusp-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // API Call Here: /api/auth/login
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      fullName: 'John Doe',
      profileCompleted: true,
      joinedDate: new Date().toISOString(),
      timezone: 'UTC',
      jobTitle: 'Social Worker',
      company: 'Care Corp',
      socialCareWork: ['Healthcare', 'Counseling']
    };
    setUser(mockUser);
    localStorage.setItem('cusp-user', JSON.stringify(mockUser));
  };

  const signup = async (fullName: string, email: string, password: string) => {
    // API Call Here: /api/auth/signup
    const newUser: User = {
      id: Date.now().toString(),
      email,
      fullName,
      profileCompleted: false,
      joinedDate: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('cusp-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cusp-user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('cusp-user', JSON.stringify(updatedUser));
    }
  };

  const completeProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data, profileCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('cusp-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      completeProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
