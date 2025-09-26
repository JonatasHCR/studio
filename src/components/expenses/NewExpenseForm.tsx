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
import { addExpense } from '@/lib/api';
import { type User } from '@/lib/types';
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
  user_id: z.number().int(),
  userName: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export function NewExpenseForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      valor: '',
      user_id: 0,
      userName: '',
    },
  });

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userData: User = JSON.parse(session);
      setUser(userData);
      form.setValue('user_id', userData.id);
      form.setValue('userName', userData.name);
    }
  }, [form]);

  async function onSubmit(data: ExpenseFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const expenseData = {
        nome: data.nome.toUpperCase(),
        tipo: data.tipo.toUpperCase(),
        valor: parseFloat(data.valor.replace(',', '.')),
        vencimento: data.vencimento.toISOString(),
        user_id: Number(data.user_id)
      };

      await addExpense(expenseData);

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
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
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
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Despesa
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
