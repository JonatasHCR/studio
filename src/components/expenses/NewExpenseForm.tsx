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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Combobox } from '../ui/combobox';
import { type Expense } from '@/lib/types';


const expenseFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: 'O valor deve ser um número.',
  }),
  dueDate: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  type: z.string().min(1, {
    message: 'Selecione um tipo de despesa.',
  }),
  createdBy: z.string().min(2, {
    message: 'O nome do criador deve ter pelo menos 2 caracteres.',
  }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export function NewExpenseForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchExpenseTypes() {
        try {
            const response = await fetch('/api/expenses');
            const expenses: Expense[] = await response.json();
            const types = new Set(expenses.map(e => e.type));
            setExpenseTypes(Array.from(types));
        } catch (error) {
            console.error("Failed to fetch expense types:", error);
        }
    }
    fetchExpenseTypes();
  }, []);

  const comboboxOptions = useMemo(() => {
    return expenseTypes.map(type => ({ value: type, label: type }));
  }, [expenseTypes]);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: '',
      createdBy: 'Usuário Exemplo', // Default creator
      type: '',
    },
  });

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...data,
            dueDate: data.dueDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar despesa');
      }

      toast({
        title: 'Sucesso!',
        description: 'Nova despesa cadastrada.',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description:
          (error as Error).message ||
          'Não foi possível cadastrar a despesa.',
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
                    <Input placeholder="Ex: Conta de Luz" {...field} />
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
                        <Input type="number" step="0.01" placeholder="150.75" {...field} />
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
                    <Combobox
                        options={comboboxOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione ou crie um tipo"
                        noResultsText="Nenhum tipo encontrado."
                    />
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
                    <Input placeholder="Seu nome" {...field} />
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
              Cadastrar Despesa
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
