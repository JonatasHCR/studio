
'use client';

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Hooks and providers
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { default as FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useDoc } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';


function initializeFirebase(config: FirebaseOptions) {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST || 'localhost';
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(firestore, host, 8080);
  }

  return { app, auth, firestore };
}

export function getFirebase() {
    return initializeFirebase(firebaseConfig);
}
