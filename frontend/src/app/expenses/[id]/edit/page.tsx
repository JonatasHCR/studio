import { EditExpenseForm } from '../../../../components/expenses/EditExpenseForm';
import { getExpenseById } from '../../../../lib/api';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';

export default async function EditExpensePage({ params }: { params: { id: string } }) {
  const expense = await getExpenseById(params.id);

  if (!expense) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-2xl font-bold md:text-3xl">
            Editar Despesa
          </h1>
          <p className="text-muted-foreground">
            {`Atualize as informações da despesa "${expense.nome}".`}
          </p>
        </div>
        <EditExpenseForm expense={expense} />
      </div>
    </PageWrapper>
  );
}
