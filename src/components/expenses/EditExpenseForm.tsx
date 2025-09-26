'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Loader } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Expense, type ExpenseStatus } from '../../lib/types';
import { updateExpense } from '../../lib/api';
import { Combobox } from '../ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  status: z.enum(['P', 'Q']),
  user_id: z.number().int(),
  userName: z.string().optional(),
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
      status: expense.status,
      user_id: expense.user_id,
      userName: expense.userName || String(expense.user_id),
    },
  });
  
  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      const expenseData = {
        ...data,
        valor: parseFloat(data.valor.replace(',', '.')),
        vencimento: data.vencimento.toISOString(),
        user_id: Number(data.user_id)
      };

      await updateExpense(String(expense.id), expenseData);

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
    form.setValue('tipo', value);
    if (value && !expenseTypes.includes(value)) {
      setExpenseTypes(prev => [...prev, value]);
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
                      onChange={(e) => field.onChange(e.target.value)}
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
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="P">Pendente</SelectItem>
                                <SelectItem value="Q">Quitada</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nome do usuário" {...field} disabled />
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
