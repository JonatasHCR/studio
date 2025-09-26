import { type Expense, type User } from './types';
import { useToast } from '@/hooks/use-toast';

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
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
      
        const errorMessage = errorData?.detail || 'Ocorreu um erro na comunicação com a API.';
        console.error('API Error:', errorMessage, 'Status:', response.status);
        
        // This is a client-side solution to a server-side problem.
        // We are displaying the raw error from the Python API to the user.
        const { toast } = useToast();
        toast({
            variant: 'destructive',
            title: 'Erro na API',
            description: String(errorMessage),
        });

        throw new Error(String(errorMessage));
    }

    if (response.status === 204) { // No Content
        return {} as T;
    }

    return response.json();
  }


// --- Auth API ---
// This is a workaround. A real sign-in would validate a password.
// Here, we just fetch the user by email.
export const signIn = async (credentials: Pick<User, 'email' | 'senha'>): Promise<User | null> => {
  try {
    // The backend doesn't have a password check, so we just get the user by email.
    const user = await fetchWrapper<User>(`/users/email/${credentials.email}`);
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    // The error toast is already shown in fetchWrapper
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
    if (expense && !expense.userName) {
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