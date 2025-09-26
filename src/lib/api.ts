import { type Expense, type User } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchWrapper<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Ocorreu um erro na comunicação com a API.');
  }
  return response.json();
}


// --- Auth API ---
export const signIn = async (credentials: Pick<User, 'name' | 'password'>): Promise<User | null> => {
  try {
    const user = await fetchWrapper<User>('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    return null;
  }
};

// --- Expenses API ---
export const getExpenses = async (): Promise<Expense[]> => {
  return fetchWrapper<Expense[]>('/despesas');
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const expense = await fetchWrapper<Expense>(`/despesas/${id}`);
    return expense;
  } catch (error) {
    console.error(`Failed to fetch expense ${id}:`, error);
    return null;
  }
};

export const addExpense = async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
  return fetchWrapper<Expense>('/despesas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense> => {
  return fetchWrapper<Expense>(`/despesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
    await fetchWrapper(`/despesas/${id}`, {
        method: 'DELETE',
    });
    return { success: true };
};
