'use client';

import { useEffect, useState, useMemo } from 'react';
import type { CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export function useCollection<T extends DocumentData>(queryRef: Query<T> | CollectionReference<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const memoizedRef = useMemo(() => queryRef, [queryRef]);

  useEffect(() => {
    if (!memoizedRef) {
      setIsLoading(false);
      setData([]);
      return;
    }
    
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      memoizedRef,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setData([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, isLoading };
}
