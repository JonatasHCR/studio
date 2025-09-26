import { expenses, users } from './data';
import { type Expense, type User, type ExpenseStatus } from './types';

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Auth API ---
export const signIn = async (credentials: Pick<User, 'email' | 'password'>): Promise<User | null> => {
    await delay(1000);
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
        return Promise.resolve(user);
    }
    return Promise.resolve(null);
};

export const signUp = async (userInfo: Pick<User, 'name' | 'email' | 'password'>): Promise<User> => {
    await delay(1000);
    if (users.find(u => u.email === userInfo.email)) {
        throw new Error('Este e-mail já está em uso por outra conta.');
    }
    if(userInfo.password.length < 6) {
        throw new Error('A senha é muito fraca. Tente uma senha mais forte.');
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        ...userInfo,
    };
    users.push(newUser);
    return Promise.resolve(newUser);
};


// --- Expenses API ---
export const getExpenses = async (): Promise<Expense[]> => {
    await delay(500);
    return Promise.resolve(JSON.parse(JSON.stringify(expenses)));
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
    await delay(500);
    const expense = expenses.find(e => e.id === id);
    return Promise.resolve(expense ? JSON.parse(JSON.stringify(expense)) : null);
};

export const addExpense = async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    await delay(1000);
    const newExpense: Expense = {
        ...data,
        id: `exp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
    return Promise.resolve(newExpense);
};

export const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense> => {
    await delay(1000);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
        throw new Error('Expense not found');
    }
    expenses[index] = { ...expenses[index], ...data, updatedAt: new Date().toISOString() };
    return Promise.resolve(expenses[index]);
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
    await delay(1000);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
        throw new Error('Expense not found');
    }
    expenses.splice(index, 1);
    return Promise.resolve({ success: true });
};
