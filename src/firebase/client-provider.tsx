'use client';

import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
    children: React.ReactNode;
}

export default function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
    return <FirebaseProvider>{children}</FirebaseProvider>;
}
