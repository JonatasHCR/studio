export type ExpenseStatus = 'due' | 'due-soon' | 'overdue' | 'paid';

export type Expense = {
  id: string;
  name: string;
  type: string;
  amount: number;
  dueDate: string; // Using string to avoid serialization issues
  status: ExpenseStatus;
  createdBy: string;
};
