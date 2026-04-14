// Main Authentication Service - Core authentication operations

import { makeApiCall } from '../shared/apiService';
import { userStorage, tokenStorage } from './authStorage';
import { createUserFromApiData } from './userUtils';
import { 
  User, 
  LoginCredentials,
  RegisterCredentials,
  AuthServiceResponse 
} from '../../components/Auth/authInterfaces';
import { API_CONFIG } from '../../config/environment';

const AUTH_BASE_URL = `${API_CONFIG.baseURL}/api`;
const CUSTOMER_BACKEND_BASE_URL = API_CONFIG.backendURL;

interface CentralizedLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

interface CentralizedMeResponse {
  sub: string;
  email: string;
  aud: string;
}

const fetchCentralizedMe = async (accessToken: string): Promise<CentralizedMeResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch authenticated user');
  }
  return data as CentralizedMeResponse;
};

const syncCustomerProfile = async (user: User): Promise<void> => {
  try {
    await makeApiCall('/user?action=profile', {
      method: 'GET',
      baseURL: CUSTOMER_BACKEND_BASE_URL,
      timeout: 10000,
      headers: {
        'x-user-email': user.email,
        'x-auth-user-id': user.id,
      },
    });
  } catch (error) {
    // Profile sync should not block authentication UX.
    console.warn('Customer profile sync failed:', error);
  }
};

// Removed retry logic - direct API calls only

/**
 * Login user with credentials
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthServiceResponse<User>> => {
  try {
    const data = await makeApiCall<CentralizedLoginResponse>('/login', {
      method: 'POST',
      baseURL: AUTH_BASE_URL,
      timeout: 15000,
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        clientId: 'default',
      }),
    });

    if (data.success && data.data?.accessToken && data.data?.refreshToken) {
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);

      const me = await fetchCentralizedMe(data.data.accessToken);
      const user = createUserFromApiData({
        id: me.sub,
        email: me.email,
        appIdentifier: me.aud,
      });

      userStorage.setUser(user);
      await syncCustomerProfile(user);
      
      return { success: true, data: user };
    }
    
    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Login failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
};

/**
 * Register new user
 */
export const registerUser = async (
  credentials: RegisterCredentials
): Promise<AuthServiceResponse<User>> => {
  try {
    const data = await makeApiCall<{ user: { id: string; email: string } }>('/register', {
      method: 'POST',
      baseURL: AUTH_BASE_URL,
      timeout: 15000,
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!data.success) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    // Auto-login after successful registration.
    return await loginUser({
      email: credentials.email,
      password: credentials.password,
      appEndpoint: credentials.appEndpoint,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<AuthServiceResponse<null>> => {
  try {
    // Centralized logout can be added here later with refresh token if needed.
    tokenStorage.clearAll();
    
    return { success: true, data: null };
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Still clear local storage even if there's an error
    tokenStorage.clearAll();
    
    return { success: true, data: null }; // Consider logout successful even if there's an error
  }
};

/**
 * Get user profile from storage
 */
export const getUserProfile = async (): Promise<AuthServiceResponse<User>> => {
  try {
    // Get user data from localStorage
    const storedUser = userStorage.getUser();
    if (storedUser) {
      const user = createUserFromApiData(storedUser);
      return { success: true, data: user };
    }
    
    return { success: false, error: 'No user data found' };
  } catch (error) {
    console.error('Get user profile failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get user profile' 
    };
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuthentication = async (): Promise<AuthServiceResponse<User>> => {
  try {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      return { success: false, error: 'No access token found' };
    }

    const me = await fetchCentralizedMe(token);
    const user = createUserFromApiData({
      id: me.sub,
      email: me.email,
      appIdentifier: me.aud,
    });
    userStorage.setUser(user);
    await syncCustomerProfile(user);
    if (user) {
      return { success: true, data: user };
    }

    return { success: false, error: 'No user data found' };
  } catch (error) {
    console.error('Authentication check failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication check failed' 
    };
  }
};