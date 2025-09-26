
export type ExpenseStatus = 'P' | 'Q';

export interface Expense {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  vencimento: string; // ISO string
  status: ExpenseStatus;
  user_id: number;
  userName?: string;
}

export interface User {
    id: number;
    nome: string;
    email: string;
}
