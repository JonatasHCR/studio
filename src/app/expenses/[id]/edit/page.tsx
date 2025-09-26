'use client';

import { useParams, useRouter } from 'next/navigation';
import { EditExpenseForm } from '@/components/expenses/EditExpenseForm';
import { useDoc } from '@/firebase';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useUser as useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

function EditExpensePageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                            <Pencil className="h-8 w-8" />
                        </div>
                        <div>
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="mt-2 h-6 w-80" />
                        </div>
                    </div>
                </header>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default function EditExpensePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { firestore } = useFirebase();
  
  const expenseRef = id && firestore ? doc(firestore, 'expenses', id) : null;
  const { data: expense, isLoading: expenseLoading } = useDoc(expenseRef);
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <EditExpensePageSkeleton />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  if (expenseLoading) {
    return <EditExpensePageSkeleton />;
  }

  if (!expense && !expenseLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Despesa não encontrada</h1>
                <p className="text-muted-foreground">Não foi possível encontrar a despesa que você está procurando.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Pencil className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Editar Despesa
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Altere as informações da despesa selecionada.
              </p>
            </div>
          </div>
        </header>
        {expense && <EditExpenseForm expense={expense} />}
      </div>
    </div>
  );
}
