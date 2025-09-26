import { NextResponse, type NextRequest } from 'next/server';
import { expenses } from '@/lib/data';
import { type Expense } from '@/lib/types';
import {differenceInDays, isBefore, parseISO, startOfDay} from "date-fns";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 });
  }

  return NextResponse.json(expense);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const updatedExpenseData = await request.json();

        const expenseIndex = expenses.findIndex((e) => e.id === id);

        if (expenseIndex === -1) {
            return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 });
        }

        // Handle simple status update
        if (updatedExpenseData.status && Object.keys(updatedExpenseData).length === 1) {
            expenses[expenseIndex].status = updatedExpenseData.status;

            // If an expense is marked as unpaid, we may need to recalculate its status
            // based on the due date.
            if (updatedExpenseData.status !== 'paid') {
                const today = startOfDay(new Date());
                const dueDate = startOfDay(parseISO(expenses[expenseIndex].dueDate));

                if (isBefore(dueDate, today)) {
                    expenses[expenseIndex].status = 'overdue';
                } else {
                    // We don't have the `dueSoonDays` config here, so we just reset to 'due'.
                    // The client will calculate the correct status on the next fetch.
                    expenses[expenseIndex].status = 'due';
                }
            }
        } else {
            // Handle full expense update
            const updatedExpense: Expense = {
                ...expenses[expenseIndex],
                ...updatedExpenseData,
                amount: parseFloat(updatedExpenseData.amount),
            };
            expenses[expenseIndex] = updatedExpense;
        }


        return NextResponse.json(expenses[expenseIndex], { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar despesa', error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const expenseIndex = expenses.findIndex((e) => e.id === id);

        if (expenseIndex === -1) {
            return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 });
        }

        expenses.splice(expenseIndex, 1);

        return NextResponse.json({ message: 'Despesa excluída com sucesso' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao excluir despesa', error }, { status: 500 });
    }
}
