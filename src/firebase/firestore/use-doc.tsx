'use client';

import { useEffect, useState, useMemo } from 'react';
import type { DocumentReference, DocumentData } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export function useDoc<T extends DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedRef = useMemo(() => docRef, [docRef?.path]);

  useEffect(() => {
    if (!memoizedRef) {
      setIsLoading(false);
      setData(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching document:', error);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, isLoading };
}
