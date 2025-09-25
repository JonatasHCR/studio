'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { ExpenseCard } from '@/components/dashboard/ExpenseCard';
import { Trophy, Hourglass, AlertTriangle, CheckCircle2, DollarSign, Ban } from 'lucide-react';

const statusConfig: Record<ExpenseStatus, { title: string; icon: ReactNode }> = {
  due: { title: 'A Vencer', icon: <Trophy className="h-8 w-8" /> },
  'due-soon': { title: 'Vencendo', icon: <Hourglass className="h-8 w-8" /> },
  overdue: { title: 'Vencidas', icon: <AlertTriangle className="h-8 w-8" /> },
  paid: { title: 'Pagas', icon: <CheckCircle2 className="h-8 w-8" /> },
};

const statusOrder: ExpenseStatus[] = ['overdue', 'due-soon', 'due', 'paid'];

export function ExpenseDashboard({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus>('overdue');

  const statusCounts = useMemo(() => {
    const counts: Record<ExpenseStatus, number> = { due: 0, 'due-soon': 0, overdue: 0, paid: 0 };
    initialExpenses.forEach((expense) => {
      counts[expense.status] = (counts[expense.status] || 0) + 1;
    });
    return counts;
  }, [initialExpenses]);

  const filteredExpenses = useMemo(() => {
    return initialExpenses.filter((e) => e.status === selectedStatus);
  }, [initialExpenses, selectedStatus]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);


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
          />
        ))}
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight">
                    Despesas {statusConfig[selectedStatus].title}
                </h3>
                <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                    <DollarSign className="h-5 w-5"/>
                    <span>
                        {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>
            </div>
        </div>
        <div className="p-6 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {filteredExpenses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ExpenseCard expense={expense} />
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
                        Não há despesas com o status "{statusConfig[selectedStatus].title}" no momento.
                    </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
