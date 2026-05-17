// Firestore Database Helper Functions
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import { User, Visitor, Helper, Payment } from '../types';

// User Management
export const createUser = async (userId: string, userData: Partial<User>) => {
  if (!db) throw new Error('Firestore not initialized');
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUser = async (userId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  if (!db) throw new Error('Firestore not initialized');
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: Timestamp.now(),
  });
};

// Community Management
export const getCommunityUsers = async (communityId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('communityId', '==', communityId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Visitor Management
export const createVisitor = async (visitorData: Partial<Visitor>) => {
  if (!db) throw new Error('Firestore not initialized');
  const visitorsRef = collection(db, 'visitors');
  const visitorRef = doc(visitorsRef);
  await setDoc(visitorRef, {
    ...visitorData,
    id: visitorRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return visitorRef.id;
};

export const getVisitors = async (userId: string, limitCount = 20) => {
  if (!db) throw new Error('Firestore not initialized');
  const visitorsRef = collection(db, 'visitors');
  const q = query(
    visitorsRef,
    where('hostUserId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateVisitor = async (visitorId: string, visitorData: Partial<Visitor>) => {
  if (!db) throw new Error('Firestore not initialized');
  const visitorRef = doc(db, 'visitors', visitorId);
  await updateDoc(visitorRef, {
    ...visitorData,
    updatedAt: Timestamp.now(),
  });
};

// Daily Help (Helper) Management
export const createHelper = async (helperData: Partial<Helper>) => {
  if (!db) throw new Error('Firestore not initialized');
  const helpersRef = collection(db, 'helpers');
  const helperRef = doc(helpersRef);
  await setDoc(helperRef, {
    ...helperData,
    id: helperRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return helperRef.id;
};

export const getHelpers = async (communityId: string, category?: string) => {
  if (!db) throw new Error('Firestore not initialized');
  const helpersRef = collection(db, 'helpers');
  let q = query(helpersRef, where('communityId', '==', communityId));

  if (category) {
    q = query(q, where('category', '==', category));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateHelper = async (helperId: string, helperData: Partial<Helper>) => {
  if (!db) throw new Error('Firestore not initialized');
  const helperRef = doc(db, 'helpers', helperId);
  await updateDoc(helperRef, {
    ...helperData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteHelper = async (helperId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  const helperRef = doc(db, 'helpers', helperId);
  await deleteDoc(helperRef);
};

// Payment Management
export const createPayment = async (paymentData: Partial<Payment>) => {
  if (!db) throw new Error('Firestore not initialized');
  const paymentsRef = collection(db, 'payments');
  const paymentRef = doc(paymentsRef);
  await setDoc(paymentRef, {
    ...paymentData,
    id: paymentRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return paymentRef.id;
};

export const getPayments = async (userId: string, limitCount = 20) => {
  if (!db) throw new Error('Firestore not initialized');
  const paymentsRef = collection(db, 'payments');
  const q = query(
    paymentsRef,
    where('userId', '==', userId),
    orderBy('dueDate', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePayment = async (paymentId: string, paymentData: Partial<Payment>) => {
  if (!db) throw new Error('Firestore not initialized');
  const paymentRef = doc(db, 'payments', paymentId);
  await updateDoc(paymentRef, {
    ...paymentData,
    updatedAt: Timestamp.now(),
  });
};
