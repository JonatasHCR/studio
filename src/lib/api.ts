import { type Expense, type User } from './types';

const API_BASE_URL = '/api';

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
export const signIn = async (credentials: Pick<User, 'email' | 'senha'>): Promise<User | null> => {
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
  try {
    return await fetchWrapper<Expense[]>('/despesas');
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const expense = await fetchWrapper<Expense>(`/despesas/${id}`);
    if (expense && !expense.userName) {
        // This is a placeholder. In a real app, you might fetch user details separately.
        expense.userName = `Usuário ${expense.user_id}`;
    }
    return expense;
  } catch (error) {
    console.error(`Failed to fetch expense ${id}:`, error);
    return null;
  }
};

export const addExpense = async (data: Omit<Expense, 'id' | 'userName'>): Promise<Expense> => {
  return fetchWrapper<Expense>('/despesas', {
    method: 'POST',
    body: JSON.stringify({
        ...data,
        user_id: Number(data.user_id),
    }),
  });
};

export const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id' | 'userName'>>): Promise<Expense> => {
    const payload: { [key: string]: any } = { ...data };
    if (data.user_id) {
        payload.user_id = Number(data.user_id);
    }
  
    return fetchWrapper<Expense>(`/despesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
    await fetchWrapper(`/despesas/${id}`, {
        method: 'DELETE',
    });
    return { success: true };
};
