
export type ExpenseStatus = 'due' | 'due-soon' | 'overdue' | 'paid';

export interface Expense {
  id: string;
  name: string;
  type: string;
  amount: number;
  dueDate: string; // ISO string
  status: ExpenseStatus;
  createdBy: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
}
