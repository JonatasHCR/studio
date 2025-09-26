import { type Expense } from '@/lib/types';
import { subDays, addDays, formatISO } from 'date-fns';

const today = new Date();

export const expenses: Expense[] = [
  { 
    id: '1', 
    name: 'Conta de Luz', 
    amount: 175.50, 
    dueDate: formatISO(subDays(today, 5)), 
    status: 'overdue',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '2', 
    name: 'Assinatura de Internet', 
    amount: 99.99, 
    dueDate: formatISO(subDays(today, 2)), 
    status: 'overdue',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  {
    id: '9',
    name: 'Fatura do Cartão',
    amount: 1250.00,
    dueDate: formatISO(subDays(today, 1)),
    status: 'overdue',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '3', 
    name: 'Academia', 
    amount: 80.00, 
    dueDate: formatISO(addDays(today, 2)), 
    status: 'due-soon',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '4', 
    name: 'Conta de Água', 
    amount: 65.20, 
    dueDate: formatISO(addDays(today, 6)), 
    status: 'due-soon',
    type: 'Nota',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '5', 
    name: 'Aluguel', 
    amount: 2200.00, 
    dueDate: formatISO(addDays(today, 15)), 
    status: 'due',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '6', 
    name: 'Seguro do Carro', 
    amount: 350.00, 
    dueDate: formatISO(addDays(today, 25)), 
    status: 'due',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  {
    id: '10',
    name: 'Plano de Celular',
    amount: 55.00,
    dueDate: formatISO(addDays(today, 20)),
    status: 'due',
    type: 'Nota',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '7', 
    name: 'Parcela do Sofá', 
    amount: 250.75, 
    dueDate: formatISO(subDays(today, 10)), 
    status: 'paid',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '8', 
    name: 'Supermercado', 
    amount: 610.30, 
    dueDate: formatISO(subDays(today, 12)), 
    status: 'paid',
    type: 'Nota',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '11', 
    name: 'Manutenção do Carro', 
    amount: 450.00, 
    dueDate: formatISO(addDays(today, 8)), 
    status: 'due',
    type: 'Nota',
    createdBy: 'Usuário Exemplo'
  },
  { 
    id: '12', 
    name: 'Netflix', 
    amount: 39.90, 
    dueDate: formatISO(addDays(today, 4)), 
    status: 'due-soon',
    type: 'Boleto',
    createdBy: 'Usuário Exemplo'
  },
];
