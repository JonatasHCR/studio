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
    throw new Error(errorData.detail || errorData.message || 'Ocorreu um erro na comunicação com a API.');
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}


// --- Auth API ---
export const signIn = async (credentials: Pick<User, 'email' | 'senha'>): Promise<User | null> => {
  try {
    const user = await fetchWrapper<User>(`/users/email/${credentials.email}`, {
      method: 'GET',
    });
    // In a real app, you'd verify the password. Here we assume if the user is found, login is successful.
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    return null;
  }
};

// --- Expenses API ---
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const expenses = await fetchWrapper<Expense[]>('/despesas/');
    // Fetch user names for each expense
    const expensesWithUserNames = await Promise.all(
        expenses.map(async (expense) => {
            try {
                const user = await fetchWrapper<User>(`/users/${expense.user_id}`);
                return { ...expense, userName: user.nome };
            } catch (error) {
                console.error(`Failed to fetch user for expense ${expense.id}:`, error);
                return { ...expense, userName: `Usuário ${expense.user_id}` };
            }
        })
    );
    return expensesWithUserNames;
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const expense = await fetchWrapper<Expense>(`/despesas/${id}`);
    if (expense && !expense.userName) {
        try {
            const user = await fetchWrapper<User>(`/users/${expense.user_id}`);
            expense.userName = user.nome;
        } catch (error) {
            console.error(`Failed to fetch user for expense ${id}:`, error);
            expense.userName = `Usuário ${expense.user_id}`;
        }
    }
    return expense;
  } catch (error) {
    console.error(`Failed to fetch expense ${id}:`, error);
    return null;
  }
};

export const addExpense = async (data: Omit<Expense, 'id' | 'userName'>): Promise<Expense> => {
  return fetchWrapper<Expense>('/despesas/', {
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
    
    // Ensure `valor` is a number
    if (payload.valor && typeof payload.valor === 'string') {
        payload.valor = parseFloat(payload.valor.replace(',', '.'));
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
