'use client';

import { type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type ExpenseStatus } from '@/lib/types';

interface StatusCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  status: ExpenseStatus;
  isSelected: boolean;
  onClick: () => void;
}

const statusStyles: Record<ExpenseStatus, { text: string }> = {
    overdue: { text: 'text-status-overdue' },
    'due-soon': { text: 'text-status-due-soon' },
    due: { text: 'text-status-due' },
    paid: { text: 'text-status-paid' }
};

export function StatusCard({ title, count, icon, status, isSelected, onClick }: StatusCardProps) {
  const styles = statusStyles[status];
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1',
        isSelected ? 'border-accent ring-2 ring-accent bg-accent/10' : 'bg-card'
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-base font-medium">{title}</CardTitle>
        <div className={cn('text-muted-foreground', styles.text)}>
            {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
}
