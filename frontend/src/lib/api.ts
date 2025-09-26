import { type Expense, type User } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchWrapper<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
      
        const errorMessage = errorData?.detail || 'Ocorreu um erro na comunicação com a API.';
        console.error('API Error:', errorMessage, 'Status:', response.status, 'URL:', url);
        
        throw new Error(String(errorMessage));
    }

    if (response.status === 204) { // No Content
        return {} as T;
    }

    return response.json();
  } catch(error) {
    console.error('Fetch failed:', error, 'URL:', url);
    throw error;
  }
}


// --- Auth API ---
export const signIn = async (credentials: Pick<User, 'nome' | 'senha'>): Promise<User | null> => {
  try {
    // The backend doesn't have a password check, so we just get the user by username.
    const user = await fetchWrapper<User>(`/users/username/${credentials.nome}`);
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    // Let the caller handle the error message display.
    return null;
  }
};

// --- Users API ---
export const getUserById = async (id: number): Promise<User | null> => {
    try {
        return await fetchWrapper<User>(`/users/${id}`);
    } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        return null;
    }
}


// --- Expenses API ---
export const getExpenses = async (): Promise<Expense[]> => {
    const expenses = await fetchWrapper<Expense[]>('/despesas/');
    // Fetch user names for all expenses in parallel
    const userPromises = expenses.map(async (expense) => {
        if (expense.user_id) {
            const user = await getUserById(expense.user_id);
            expense.userName = user ? user.nome : `Usuário ${expense.user_id}`;
        }
        return expense;
    });
    return Promise.all(userPromises);
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const expense = await fetchWrapper<Expense>(`/despesas/${id}`);
    if (expense && !expense.userName) {
        // This is a fallback if the user name isn't joined in the backend
        const user = await fetchWrapper<User>(`/users/${expense.user_id}`);
        expense.userName = user ? user.nome : `Usuário ${expense.user_id}`;
    }
    return expense;
  } catch (error) {
    console.error(`Failed to fetch expense ${id}:`, error);
    return null;
  }
};

export const addExpense = async (data: Omit<Expense, 'id' | 'userName' | 'dynamicStatus'>): Promise<Expense> => {
  return fetchWrapper<Expense>('/despesas/', {
    method: 'POST',
    body: JSON.stringify({
        ...data,
        user_id: Number(data.user_id),
        valor: Number(data.valor),
        vencimento: data.vencimento.split('T')[0], // Format to YYYY-MM-DD
    }),
  });
};

export const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id' | 'userName' | 'dynamicStatus'>>): Promise<Expense> => {
    const payload: { [key: string]: any } = { ...data };
    if (data.user_id) {
        payload.user_id = Number(data.user_id);
    }
    if (data.valor) {
        payload.valor = Number(data.valor);
    }
     if (data.vencimento) {
        payload.vencimento = data.vencimento.split('T')[0]; // Format to YYYY-MM-DD
    }
  
    return fetchWrapper<Expense>(`/despesas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
};

export const deleteExpense = async (id: string): Promise<void> => {
    await fetchWrapper(`/despesas/${id}`, {
        method: 'DELETE',
    });
};