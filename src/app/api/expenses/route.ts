import { NextResponse } from 'next/server';
import { expenses as rawExpenses } from '@/lib/data';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { isBefore, isAfter, differenceInDays, startOfDay, parseISO } from 'date-fns';

function getDynamicStatus(expense: Expense): ExpenseStatus {
    if (expense.status === 'paid') {
      return 'paid';
    }
  
    const today = startOfDay(new Date());
    const dueDate = startOfDay(parseISO(expense.dueDate));
  
    if (isBefore(dueDate, today)) {
      return 'overdue';
    }
  
    const daysUntilDue = differenceInDays(dueDate, today);
  
    if (daysUntilDue <= 5) {
      return 'due-soon';
    }
  
    return 'due';
  }

export async function GET() {
  const dynamicallyUpdatedExpenses = rawExpenses.map(expense => ({
    ...expense,
    status: getDynamicStatus(expense),
  }));
  
  return NextResponse.json(dynamicallyUpdatedExpenses);
}
