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
import { updateExpense } from '@/lib/api';
import { Combobox } from '@/components/ui/combobox';


const expenseFormSchema = z.object({
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  valor: z.string().refine((val) => !isNaN(parseFloat(val.replace(',', '.'))), {
    message: 'O valor deve ser um número.',
  }),
  vencimento: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  tipo: z.string().min(1, {
    message: 'Selecione ou crie um tipo de despesa.',
  }),
  user_id: z.number(),
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
      nome: expense.nome,
      valor: String(expense.valor).replace('.', ','),
      vencimento: parseISO(expense.vencimento),
      tipo: expense.tipo,
      user_id: expense.user_id,
    },
  });
  
  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      await updateExpense(String(expense.id), {
        ...data,
        nome: data.nome.toUpperCase(),
        tipo: data.tipo.toUpperCase(),
        valor: parseFloat(data.valor.replace(',', '.')),
        vencimento: data.vencimento.toISOString(),
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

  const comboboxOptions = useMemo(() => expenseTypes.map(type => ({ value: type, label: type })), [expenseTypes]);
  
  const handleTypeChange = (value: string) => {
    const upperCaseValue = value.toUpperCase();
    form.setValue('tipo', upperCaseValue);
    if (value && !expenseTypes.includes(upperCaseValue)) {
      setExpenseTypes(prev => [...prev, upperCaseValue]);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Despesa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Conta de Luz"
                      {...field}
                      className="uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="valor"
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
                  name="vencimento"
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
              name="tipo"
              render={({ field }) => (
                 <FormItem className="flex flex-col">
                  <FormLabel>Tipo de Despesa</FormLabel>
                    <Combobox
                        options={comboboxOptions}
                        value={field.value}
                        onChange={handleTypeChange}
                        placeholder="Selecione ou crie um tipo"
                        searchPlaceholder="Pesquisar ou criar..."
                        emptyMessage="Nenhum tipo encontrado. Crie um novo."
                        isCreatable={true}
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Usuário</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ID do usuário" {...field}  onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} disabled />
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
