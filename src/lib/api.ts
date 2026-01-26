// Centralized API client with Bearer token handling

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getStoredToken(): string | null {
  return sessionStorage.getItem('authToken');
}

function setStoredToken(token: string): void {
  sessionStorage.setItem('authToken', token);
}

function removeStoredToken(): void {
  sessionStorage.removeItem('authToken');
}

function getStoredProfileId(): string | null {
  return sessionStorage.getItem('currentProfileId');
}

function setStoredProfileId(profileId: string): void {
  sessionStorage.setItem('currentProfileId', profileId);
}

function removeStoredProfileId(): void {
  sessionStorage.removeItem('currentProfileId');
}

// Event to notify about session expiration
const SESSION_EXPIRED_EVENT = 'session:expired';

export function onSessionExpired(callback: () => void): () => void {
  window.addEventListener(SESSION_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, callback);
}

function dispatchSessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers = {}, ...fetchOptions } = options;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add Bearer token if available and not skipping auth
  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Handle 401 - session expired
  if (response.status === 401) {
    removeStoredToken();
    removeStoredProfileId();
    dispatchSessionExpired();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || error.detail || 'Erro na requisição');
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// Auth-specific functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      }
    );
    setStoredToken(response.access_token);
    return response;
  },

  signup: async (email: string, password: string, name: string) => {
    const response = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        skipAuth: true,
      }
    );
    setStoredToken(response.access_token);
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    } finally {
      removeStoredToken();
      removeStoredProfileId();
    }
  },

  getMe: async () => {
    return apiRequest<{ id: string; email: string; name: string }>('/auth/me');
  },

  hasToken: () => !!getStoredToken(),
};

// Profile-specific functions
export const profilesApi = {
  getAll: async () => {
    // Returns array directly, not { profiles, total }
    return apiRequest<Array<{
      id: string;
      user_id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }>>('/auth/profiles');
  },

  create: async (data: { name: string; description?: string }) => {
    return apiRequest<{
      id: string;
      user_id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }>('/auth/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { name: string; description?: string }) => {
    return apiRequest<{
      id: string;
      user_id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }>(`/auth/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/auth/profiles/${id}`, {
      method: 'DELETE',
    });
  },

  setCurrentId: setStoredProfileId,
  getCurrentId: getStoredProfileId,
  clearCurrentId: removeStoredProfileId,
};

// Subscription-specific functions  
export const subscriptionApi = {
  get: async () => {
    return apiRequest<{ subscription: any }>('/subscription');
  },

  getInvoices: async () => {
    return apiRequest<{ invoices: any[] }>('/subscription/invoices');
  },

  cancel: async (immediately: boolean = false) => {
    return apiRequest<{ subscription: any }>('/subscription/cancel', {
      method: 'POST',
      body: JSON.stringify({ immediately }),
    });
  },

  resume: async () => {
    return apiRequest<{ subscription: any }>('/subscription/resume', {
      method: 'POST',
    });
  },

  changePlan: async (planId: string, billingCycle: string) => {
    return apiRequest<{ subscription: any }>('/subscription/change-plan', {
      method: 'POST',
      body: JSON.stringify({ planId, billingCycle }),
    });
  },

  getPortalUrl: async () => {
    return apiRequest<{ url: string }>('/subscription/portal');
  },
};

export { getStoredToken, setStoredToken, removeStoredToken };
