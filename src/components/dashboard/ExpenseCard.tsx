import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { CalendarDays, DollarSign, MoreVertical, Pencil, Check, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
            <div className="flex flex-col gap-2">
                <CardTitle className="font-headline text-lg font-semibold">{expense.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{expense.type}</Badge>
            </div>
            <div className="flex items-center gap-1">
                <div className={cn("flex items-center gap-1.5 text-lg font-bold", styles.text)}>
                    <span>
                        {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                        Vencimento: {format(dueDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                        Criado por: {expense.createdBy}
                    </span>
                </div>
            </div>
            {expense.status !== 'paid' ? (
                <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Pagar
                </Button>
            ) : (
                <Button variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Não Paga
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
