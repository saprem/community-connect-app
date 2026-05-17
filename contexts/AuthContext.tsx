import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { signInWithEmail as firebaseSignInWithEmail, signUpWithEmail, signOut as firebaseSignOut } from '../services/firebaseAuth';
import { createUser, getUser, updateUser } from '../services/firestoreHelpers';

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
    // If Firebase is configured, listen to auth state changes
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Load user data from Firestore
          try {
            const userData = await getUser(firebaseUser.uid);
            if (userData) {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                phone: userData.phone || '',
                name: userData.name || firebaseUser.displayName || '',
                communityId: userData.communityId,
                role: userData.role,
                verified: userData.verified || false,
              } as User);
            } else {
              // Create basic user profile from Firebase auth
              const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                phone: '',
                name: firebaseUser.displayName || '',
                verified: false,
              };
              setUser(newUser);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fallback to AsyncStorage for mock mode
      loadUser();
    }
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
    // For now, simulate OTP send with a mock OTP: 123456
    setPendingPhone(phone);
    // In production, this would send SMS via Firebase
    console.log('🔐 OTP sent to:', phone);
    console.log('📱 For testing, use OTP: 123456');
  };

  const verifyOTP = async (otp: string) => {
    // TODO: Verify OTP with Firebase
    // For testing: Accept "123456" or any 6-digit code
    if (otp.length !== 6) {
      throw new Error('OTP must be 6 digits');
    }

    // For testing, accept 123456 or any 6-digit code
    if (otp === '123456' || otp.length === 6) {
      const newUser: User = {
        id: Date.now().toString(),
        phone: pendingPhone,
        verified: false, // Will be set to true after profile setup
      };
      await saveUser(newUser);
      setPendingPhone('');
      console.log('✅ OTP verified successfully!');
    } else {
      throw new Error('Invalid OTP. Use 123456 for testing.');
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
    if (auth) {
      // Use real Firebase authentication
      await firebaseSignInWithEmail(email, password);
      // User state will be updated by onAuthStateChanged listener
    } else {
      // Mock mode for development without Firebase
      const newUser: User = {
        id: Date.now().toString(),
        phone: '',
        email,
        verified: false,
      };
      await saveUser(newUser);
    }
  };

  const signUp = async (email: string, password: string, phone: string) => {
    if (auth) {
      // Use real Firebase authentication
      const firebaseUser = await signUpWithEmail(email, password);
      // Create user profile in Firestore
      await createUser(firebaseUser.uid, {
        id: firebaseUser.uid,
        phone,
        email,
        verified: false,
      } as any);
      // User state will be updated by onAuthStateChanged listener
    } else {
      // Mock mode for development without Firebase
      const newUser: User = {
        id: Date.now().toString(),
        phone,
        email,
        verified: false,
      };
      await saveUser(newUser);
    }
  };

  const signOut = async () => {
    try {
      if (auth) {
        // Use real Firebase sign out
        await firebaseSignOut();
      } else {
        // Mock mode
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      if (auth) {
        // Update in Firestore
        await updateUser(user.id, data as any);
        // Update local state
        setUser({ ...user, ...data });
      } else {
        // Mock mode - update AsyncStorage
        const updatedUser = { ...user, ...data };
        await saveUser(updatedUser);
      }
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
