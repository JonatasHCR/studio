
export type ExpenseStatus = 'due' | 'due-soon' | 'overdue' | 'paid';

export interface Expense {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  vencimento: string; // ISO string
  user_id: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
}
