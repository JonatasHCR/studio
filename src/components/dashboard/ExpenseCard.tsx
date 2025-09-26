'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { CalendarDays, DollarSign, MoreVertical, Pencil, Check, User, X, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


const statusStyles: Record<ExpenseStatus, { text: string; border: string }> = {
    overdue: { text: 'text-status-overdue', border: 'border-l-status-overdue' },
    'due-soon': { text: 'text-status-due-soon', border: 'border-l-status-due-soon' },
    due: { text: 'text-status-due', border: 'border-l-status-due' },
    paid: { text: 'text-status-paid', border: 'border-l-status-paid' }
};

interface ExpenseCardProps {
  expense: Expense;
  onStatusChange: () => void;
}

export function ExpenseCard({ expense, onStatusChange }: ExpenseCardProps) {
  const dueDate = new Date(expense.dueDate);
  const styles = statusStyles[expense.status];
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const handleStatusChange = async (newStatus: ExpenseStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o status da despesa');
      }
      
      toast({
        title: 'Sucesso!',
        description: `Despesa marcada como ${newStatus === 'paid' ? 'paga' : 'não paga'}.`,
      });

      onStatusChange(); // Re-fetch expenses
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description: (error as Error).message || 'Não foi possível atualizar o status.',
      });
    } finally {
      setIsUpdating(false);
      setIsAlertDialogOpen(false);
    }
  };

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
                        <DropdownMenuItem asChild>
                          <Link href={`/expenses/${expense.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
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
                 <AlertDialogTrigger asChild>
                    {expense.status !== 'paid' ? (
                        <Button disabled={isUpdating}>
                            <Check className="mr-2 h-4 w-4" />
                            Pagar
                        </Button>
                    ) : (
                        <Button variant="outline" disabled={isUpdating}>
                            <X className="mr-2 h-4 w-4" />
                            Não Paga
                        </Button>
                    )}
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Alteração de Status</AlertDialogTitle>
                <AlertDialogDescription>
                    {`Tem certeza que deseja marcar a despesa "${expense.name}" como ${expense.status !== 'paid' ? 'paga' : 'não paga'}?`}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange(expense.status !== 'paid' ? 'paid' : 'due')} disabled={isUpdating}>
                    {isUpdating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
