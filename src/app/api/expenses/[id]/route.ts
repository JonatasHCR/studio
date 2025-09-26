import { NextResponse, type NextRequest } from 'next/server';
import { expenses } from '@/lib/data';
import { type Expense } from '@/lib/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 });
  }

  return NextResponse.json(expense);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const updatedExpenseData = await request.json();

        const expenseIndex = expenses.findIndex((e) => e.id === id);

        if (expenseIndex === -1) {
            return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 });
        }

        const updatedExpense: Expense = {
            ...expenses[expenseIndex],
            ...updatedExpenseData,
            amount: parseFloat(updatedExpenseData.amount),
        };

        expenses[expenseIndex] = updatedExpense;

        return NextResponse.json(updatedExpense, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar despesa', error }, { status: 500 });
    }
}
