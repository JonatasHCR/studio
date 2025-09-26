import { NewExpenseForm } from '@/components/expenses/NewExpenseForm';
import { FilePlus } from 'lucide-react';

export default function NewExpensePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <FilePlus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Cadastrar Nova Despesa
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Preencha as informações para adicionar uma nova despesa.
              </p>
            </div>
          </div>
        </header>
        <NewExpenseForm />
      </div>
    </div>
  );
}
