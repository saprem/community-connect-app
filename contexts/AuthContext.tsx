import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  communityId?: string;
  role?: 'owner' | 'tenant' | 'security' | 'admin';
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const signInWithPhone = async (phone: string) => {
    // TODO: Integrate with Firebase Phone Auth
    // For now, simulate OTP send
    setPendingPhone(phone);
    // In production, this would send SMS via Firebase
    console.log('OTP sent to:', phone);
  };

  const verifyOTP = async (otp: string) => {
    // TODO: Verify OTP with Firebase
    // For now, accept any 6-digit code
    if (otp.length === 6) {
      const newUser: User = {
        id: Date.now().toString(),
        phone: pendingPhone,
        verified: true,
      };
      await saveUser(newUser);
      setPendingPhone('');
    } else {
      throw new Error('Invalid OTP');
    }
  };

  const signInWithGoogle = async () => {
    // TODO: Integrate with Firebase Google Auth
    // For now, create a mock user
    const newUser: User = {
      id: Date.now().toString(),
      phone: '',
      email: 'user@gmail.com',
      name: 'Google User',
      verified: true,
    };
    await saveUser(newUser);
  };

  const signInWithEmail = async (email: string, password: string) => {
    // TODO: Integrate with Firebase Email Auth
    const newUser: User = {
      id: Date.now().toString(),
      phone: '',
      email,
      verified: false,
    };
    await saveUser(newUser);
  };

  const signUp = async (email: string, password: string, phone: string) => {
    // TODO: Integrate with Firebase Auth
    const newUser: User = {
      id: Date.now().toString(),
      phone,
      email,
      verified: false,
    };
    await saveUser(newUser);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      await saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithPhone,
        verifyOTP,
        signInWithGoogle,
        signInWithEmail,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
