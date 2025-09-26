'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ExpenseDashboard } from '../components/dashboard/ExpenseDashboard';
import { Loader, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';

function Home() {
  const router = useRouter();
  
  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline text-2xl font-bold md:text-3xl">
              Painel de Despesas
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie suas finanças de forma simples.
            </p>
          </div>
          <Button onClick={() => router.push('/expenses/new')}>
            <PlusCircle />
            <span>Nova Despesa</span>
          </Button>
        </div>
        <Suspense fallback={<Loader className="mx-auto my-16 h-8 w-8 animate-spin" />}>
          <ExpenseDashboard />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

export default Home;
