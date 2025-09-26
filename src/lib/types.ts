import { type Timestamp } from 'firebase/firestore';

export type ExpenseStatus = 'due' | 'due-soon' | 'overdue' | 'paid';

export interface Expense {
  id: string;
  name: string;
  type: string;
  amount: number;
  dueDate: string; // Should be ISO string
  status: ExpenseStatus;
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}


export type ExpenseDocument = Omit<Expense, 'id' | 'dueDate'> & {
  dueDate: Timestamp;
};
