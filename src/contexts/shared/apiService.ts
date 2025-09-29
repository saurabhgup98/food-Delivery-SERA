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
    baseURL = 'https://simple-authentication-service.vercel.app/api', // Updated to new auth service
    timeout = 10000,
    headers = {},
    ...fetchOptions
  } = options;

  // No token management needed in new authentication system
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...fetchOptions,
  };

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Request timeout after', timeout, 'ms');
      controller.abort();
    }, timeout);

    const fullUrl = `${baseURL}${endpoint}`;
    console.log('Making API call to:', fullUrl, 'with config:', config);

    const response = await fetch(fullUrl, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse JSON, use the status text
        console.error('Failed to parse error response as JSON');
      }
      throw new Error(errorMessage);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your internet connection and try again');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
    }
    
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
