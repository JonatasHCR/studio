'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Expense } from '@/lib/types';
import { updateExpense, getExpenses } from '@/lib/api';


const expenseFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val.replace(',', '.'))), {
    message: 'O valor deve ser um número.',
  }),
  dueDate: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  type: z.string().min(1, {
    message: 'Selecione ou crie um tipo de despesa.',
  }),
  createdBy: z.string().min(1, 'O criador é obrigatório.'),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export function EditExpenseForm({ expense }: { expense: Expense }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: expense.name,
      amount: expense.amount.toString().replace('.', ','),
      dueDate: parseISO(expense.dueDate),
      type: expense.type,
      createdBy: expense.createdBy,
    },
  });
  
  useEffect(() => {
    async function fetchExpenseTypes() {
        try {
            const expenses = await getExpenses();
            const types = new Set(expenses.map(e => e.type as string));
            setExpenseTypes(Array.from(types));
        } catch (error) {
            console.error("Failed to fetch expense types:", error);
        }
    }
    fetchExpenseTypes();
  }, []);
  
  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      await updateExpense(expense.id, {
        ...data,
        amount: parseFloat(data.amount.replace(',', '.')),
        dueDate: data.dueDate.toISOString(),
      });

      toast({
        title: 'Sucesso!',
        description: 'Despesa atualizada.',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description:
          (error as Error).message ||
          'Não foi possível atualizar a despesa.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Despesa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Conta de Luz"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="150,75" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Vencimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                 <FormItem className="flex flex-col">
                  <FormLabel>Tipo de Despesa</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <select
                        {...field}
                        className={cn(
                          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none'
                        )}
                      >
                        <option value="" disabled>Selecione um tipo</option>
                        {expenseTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </FormControl>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criado por</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
