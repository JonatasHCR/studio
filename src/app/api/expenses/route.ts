import { NextResponse, type NextRequest } from 'next/server';
import { expenses as rawExpenses } from '@/lib/data';
import { type Expense, type ExpenseStatus } from '@/lib/types';
import { isBefore, isAfter, differenceInDays, startOfDay, parseISO } from 'date-fns';

function getDynamicStatus(expense: Expense, dueSoonDays: number): ExpenseStatus {
    if (expense.status === 'paid') {
      return 'paid';
    }
  
    const today = startOfDay(new Date());
    const dueDate = startOfDay(parseISO(expense.dueDate));
  
    if (isBefore(dueDate, today)) {
      return 'overdue';
    }
  
    const daysUntilDue = differenceInDays(dueDate, today);
  
    if (daysUntilDue <= dueSoonDays) {
      return 'due-soon';
    }
  
    return 'due';
  }

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dueSoonDaysParam = searchParams.get('dueSoonDays');
  const dueSoonDays = dueSoonDaysParam ? parseInt(dueSoonDaysParam, 10) : 5;

  const dynamicallyUpdatedExpenses = rawExpenses.map(expense => ({
    ...expense,
    status: getDynamicStatus(expense, dueSoonDays),
  }));
  
  return NextResponse.json(dynamicallyUpdatedExpenses);
}

export async function POST(request: NextRequest) {
  try {
    const newExpenseData = await request.json();
    
    const newExpense: Expense = {
      id: (rawExpenses.length + 1).toString(),
      status: 'due', // Default status for new expenses
      ...newExpenseData,
      amount: parseFloat(newExpenseData.amount),
    };

    rawExpenses.push(newExpense);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar despesa', error }, { status: 500 });
  }
}
