import { type Expense, type User } from './types';
import { subDays, addDays } from 'date-fns';

// In-memory data stores
export let users: User[] = [
    { id: 'user-1', name: 'Administrador', email: 'adm@example.com', password: '123456' }
];

export let expenses: Expense[] = [
  {
    id: 'exp-1',
    name: 'ASSINATURA NETFLIX',
    amount: 39.9,
    dueDate: addDays(new Date(), 2).toISOString(),
    type: 'Streaming',
    status: 'due-soon',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    name: 'CONTA DE LUZ',
    amount: 180.55,
    dueDate: subDays(new Date(), 5).toISOString(),
    type: 'Boleto',
    status: 'overdue',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    name: 'ALUGUEL APARTAMENTO',
    amount: 1500.0,
    dueDate: addDays(new Date(), 10).toISOString(),
    type: 'Aluguel',
    status: 'due',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-4',
    name: 'FATURA CARTÃO DE CRÉDITO',
    amount: 850.75,
    dueDate: subDays(new Date(), 30).toISOString(),
    type: 'Nota',
    status: 'paid',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-5',
    name: 'MENSALIDADE ACADEMIA',
    amount: 99.9,
    dueDate: new Date().toISOString(),
    type: 'Boleto',
    status: 'due-soon',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-6',
    name: 'COMPRAS SUPERMERCADO',
    amount: 450.0,
    dueDate: addDays(new Date(), 25).toISOString(),
    type: 'Nota',
    status: 'due',
    createdBy: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
