'use client';

import { useState, useMemo, type ReactNode, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { ExpenseCard } from '@/components/dashboard/ExpenseCard';
import { Hourglass, AlertTriangle, CheckCircle2, Ban, Loader, FileText, ChevronLeft, ChevronRight, Search, Filter, CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusConfig: Record<ExpenseStatus, { title: string; icon: ReactNode }> = {
  due: { title: 'A Vencer', icon: <FileText className="h-8 w-8" /> },
  'due-soon': { title: 'Vencendo', icon: <Hourglass className="h-8 w-8" /> },
  overdue: { title: 'Vencidas', icon: <AlertTriangle className="h-8 w-8" /> },
  paid: { title: 'Pagas', icon: <CheckCircle2 className="h-8 w-8" /> },
};

const statusOrder: ExpenseStatus[] = ['due', 'due-soon', 'overdue', 'paid'];

type FilterField = 'name' | 'type' | 'dueDate' | 'createdBy';

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statusOrder.map((status) => (
                    <CardSkeleton key={status} />
                ))}
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-6 pt-0">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                           <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardSkeleton() {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

export function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus>('due');
  const [dueSoonDays, setDueSoonDays] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filterField, setFilterField] = useState<FilterField>('name');
  const [filterValue, setFilterValue] = useState<string | Date | undefined>('');

  const fetchExpenses = useCallback(async (days: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expenses?dueSoonDays=${days}`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses(dueSoonDays);
  }, [fetchExpenses, dueSoonDays]);
  
  const handleStatusChange = () => {
    fetchExpenses(dueSoonDays);
  };

  const expenseTypes = useMemo(() => {
    const types = new Set(expenses.map(e => e.type));
    return ['Todos', ...Array.from(types)];
  }, [expenses]);
  
  useEffect(() => {
    setFilterValue('');
  }, [filterField]);

  const statusCounts = useMemo(() => {
    const counts: Record<ExpenseStatus, number> = { due: 0, 'due-soon': 0, overdue: 0, paid: 0 };
    expenses.forEach((expense) => {
      counts[expense.status] = (counts[expense.status] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
        if (e.status !== selectedStatus) return false;
        
        if (!filterValue) return true;

        switch (filterField) {
            case 'name':
                return e.name.toLowerCase().startsWith((filterValue as string).toLowerCase());
            case 'createdBy':
                return e.createdBy.toLowerCase().startsWith((filterValue as string).toLowerCase());
            case 'type':
                 return filterValue === 'Todos' || e.type === filterValue;
            case 'dueDate':
                return isSameDay(parseISO(e.dueDate), filterValue as Date);
            default:
                return true;
        }
    });
  }, [expenses, selectedStatus, filterField, filterValue]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, itemsPerPage, filterField, filterValue]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  const totalAmount = useMemo(() => {
    return currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [currentExpenses]);
  
  const renderFilterInput = () => {
    switch (filterField) {
        case 'dueDate':
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-full sm:w-64 justify-start text-left font-normal',
                                !filterValue && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filterValue ? format(filterValue as Date, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={filterValue as Date}
                            onSelect={(date) => setFilterValue(date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            );
        case 'type':
            return (
                 <Select value={filterValue as string || 'Todos'} onValueChange={(value) => setFilterValue(value)}>
                    <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {expenseTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case 'name':
        case 'createdBy':
        default:
            return (
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Pesquisar..."
                        value={filterValue as string || ''}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="pl-10"
                    />
                </div>
            );
    }
  }

  if (loading && expenses.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusOrder.map((status) => (
          <StatusCard
            key={status}
            title={statusConfig[status].title}
            count={statusCounts[status] || 0}
            icon={statusConfig[status].icon}
            status={status}
            isSelected={selectedStatus === status}
            onClick={() => setSelectedStatus(status)}
            dueSoonDays={dueSoonDays}
            setDueSoonDays={setDueSoonDays}
          />
        ))}
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className="flex flex-col space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight w-full sm:w-auto">
                    Despesas {statusConfig[selectedStatus].title}
                </h3>
                <div className="flex items-center gap-4 w-full sm:w-auto flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filterField} onValueChange={(value) => setFilterField(value as FilterField)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filtrar por..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Nome da Despesa</SelectItem>
                                <SelectItem value="type">Tipo</SelectItem>
                                <SelectItem value="dueDate">Data de Vencimento</SelectItem>
                                <SelectItem value="createdBy">Criado Por</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {renderFilterInput()}
                </div>
            </div>
             <div className="flex items-center justify-end gap-2 text-lg font-semibold text-muted-foreground">
                <span>
                    {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
        </div>
        <div className="p-6 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus + currentPage + itemsPerPage + filterField + String(filterValue)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {currentExpenses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {currentExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ExpenseCard expense={expense} onStatusChange={handleStatusChange} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-background/50 p-12 text-center">
                    <div className="rounded-full bg-secondary p-4">
                        <Ban className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="font-headline text-lg font-medium text-muted-foreground">
                        Nenhuma despesa encontrada
                    </p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Não há despesas com os filtros selecionados.
                    </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        {filteredExpenses.length > 0 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm text-muted-foreground">Itens por página:</Label>
              <Input
                id="items-per-page"
                type="number"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="h-8 w-20"
                min="1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
