// Firebase Authentication Helper Functions
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase.config';

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with display name if provided
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Send email verification
  await sendEmailVerification(user);

  return user;
};

export const signOut = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  await firebaseSignOut(auth);
};

export const sendPasswordReset = async (email: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  await sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = async (user: FirebaseUser, data: { displayName?: string; photoURL?: string }) => {
  await updateProfile(user, data);
};

// Get current user
export const getCurrentUser = () => {
  return auth?.currentUser || null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return auth?.currentUser !== null;
};
