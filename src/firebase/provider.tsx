'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirebase } from '.';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const { app, auth, firestore } = getFirebase();

  const value = useMemo(
    () => ({
      app,
      auth,
      firestore,
    }),
    [app, auth, firestore]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = () => {
  return useContext(FirebaseContext).app;
};

export const useAuth = () => {
  return useContext(FirebaseContext);
};

export const useFirestore = () => {
  return useContext(FirebaseContext);
};
