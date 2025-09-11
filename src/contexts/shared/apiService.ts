// Shared API service utilities

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
}

/**
 * Generic API call function with error handling and token management
 */
export const makeApiCall = async <T = any>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    baseURL = '',
    timeout = 10000,
    headers = {},
    ...fetchOptions
  } = options;

  // Get access token from localStorage
  const accessToken = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    },
    ...fetchOptions,
  };

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * API call with automatic retry on failure
 */
export const makeApiCallWithRetry = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {},
  maxRetries: number = 3
): Promise<ApiResponse<T>> => {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await makeApiCall<T>(endpoint, options);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error(lastError?.message || 'API request failed after retries');
};
