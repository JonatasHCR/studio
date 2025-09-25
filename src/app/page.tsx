import { expenses } from '@/lib/data';
import { ExpenseDashboard } from '@/components/dashboard/ExpenseDashboard';
import { FileSpreadsheet } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                    <FileSpreadsheet className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Painel de Despesas
                    </h1>
                    <p className="mt-1 text-lg text-muted-foreground">
                        Visualize e gerencie suas finanças de forma simples.
                    </p>
                </div>
            </div>
        </header>
        <ExpenseDashboard initialExpenses={expenses} />
      </div>
    </main>
  );
}
