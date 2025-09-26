'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { CalendarDays, MoreVertical, Pencil, Check, User, X, Loader, Trash2 } from 'lucide-react';
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
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';


const statusStyles: Record<ExpenseStatus, { text: string; border: string }> = {
    overdue: { text: 'text-status-overdue', border: 'border-l-status-overdue' },
    'due-soon': { text: 'text-status-due-soon', border: 'border-l-status-due-soon' },
    due: { text: 'text-status-due', border: 'border-l-status-due' },
    paid: { text: 'text-status-paid', border: 'border-l-status-paid' }
};

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const dueDate = new Date(expense.dueDate);
  const styles = statusStyles[expense.status];
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusAlertOpen, setIsStatusAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const { firestore } = useFirebase();

  const handleStatusChange = async (newStatus: ExpenseStatus) => {
    if (!firestore) return;
    setIsUpdating(true);
    try {
      const expenseRef = doc(firestore, 'expenses', expense.id);
      await updateDoc(expenseRef, { status: newStatus });
      
      toast({
        title: 'Sucesso!',
        description: `Despesa marcada como ${newStatus === 'paid' ? 'paga' : 'não paga'}.`,
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description: (error as Error).message || 'Não foi possível atualizar o status.',
      });
    } finally {
      setIsUpdating(false);
      setIsStatusAlertOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!firestore) return;
    setIsDeleting(true);
    try {
      const expenseRef = doc(firestore, 'expenses', expense.id);
      await deleteDoc(expenseRef);

      toast({
          title: 'Sucesso!',
          description: 'A despesa foi excluída.',
      });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Algo deu errado.',
            description: (error as Error).message || 'Não foi possível excluir a despesa.',
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteAlertOpen(false);
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
                        <DropdownMenuSeparator />
                        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {`Tem certeza que deseja excluir permanentemente a despesa "${expense.name}"? Esta ação não pode ser desfeita.`}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                    {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                    Excluir
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isStatusAlertOpen} onOpenChange={setIsStatusAlertOpen}>
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
