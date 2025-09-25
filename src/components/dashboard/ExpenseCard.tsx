import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { CalendarDays, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusStyles: Record<ExpenseStatus, { text: string; border: string }> = {
    overdue: { text: 'text-status-overdue', border: 'border-l-status-overdue' },
    'due-soon': { text: 'text-status-due-soon', border: 'border-l-status-due-soon' },
    due: { text: 'text-status-due', border: 'border-l-status-due' },
    paid: { text: 'text-status-paid', border: 'border-l-status-paid' }
};

export function ExpenseCard({ expense }: { expense: Expense }) {
  const dueDate = new Date(expense.dueDate);
  const styles = statusStyles[expense.status];

  return (
    <Card className={cn("flex flex-col justify-between h-full transition-shadow hover:shadow-md border-l-4", styles.border)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="font-headline text-lg font-semibold">{expense.name}</CardTitle>
            <div className={cn("flex items-center gap-1.5 text-lg font-bold", styles.text)}>
                <DollarSign className="h-5 w-5" />
                <span>
                    {expense.amount.toLocaleString('pt-BR')}
                </span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            Vencimento: {format(dueDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
