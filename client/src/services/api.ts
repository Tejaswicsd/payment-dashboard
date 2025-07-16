import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000'; // Keep this for web
const TOKEN_KEY = 'jwt_token';

// -------------------- Types -------------------- //
export interface CreatePaymentRequest {
  amount: number;
  receiver: string;
  description: string;
  status: 'pending' | 'success' | 'failed';
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'crypto';
}

export interface Payment {
  id: string;
  amount: number;
  receiver: string;
  description: string;
  status: 'pending' | 'success' | 'failed';
  method: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// -------------------- API Class -------------------- //
class ApiService {
  private baseURL = API_BASE_URL;

  // Token Management
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Header Builder
  private async createHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Unified Request Handler
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.createHeaders(includeAuth);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await this.removeToken();
          throw new Error('Authentication failed. Please login again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // -------------------- Auth -------------------- //
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false
    );

    await this.storeToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.removeToken();
    // Optional: notify server about logout
    // await this.makeRequest('/auth/logout', { method: 'POST' });
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // -------------------- Payments -------------------- //
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    return this.makeRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPayments(filters: TransactionFilters = {}): Promise<PaginatedResponse<Payment>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<PaginatedResponse<Payment>>(endpoint);
  }

  async getPaymentById(id: string): Promise<Payment> {
    return this.makeRequest<Payment>(`/payments/${id}`);
  }

  async updatePayment(id: string, paymentData: Partial<CreatePaymentRequest>): Promise<Payment> {
    return this.makeRequest<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string): Promise<void> {
    return this.makeRequest<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
