/**
 * API Service
 * Centralized API calls with error handling and interceptors
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getApiConfig, API_ENDPOINTS } from '../config/environment';
import { APIError, handleAPIError, logError, retryOperation } from '../utils/errorHandler';

/**
 * Initialize API client with configuration and interceptors
 */
class APIService {
  private client: AxiosInstance;

  constructor() {
    const config = getApiConfig();
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add auth token if available
        // const token = AsyncStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      error => {
        logError('API Request Interceptor', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      error => {
        const apiError = this.handleError(error);
        logError('API Response Interceptor', apiError);
        return Promise.reject(apiError);
      },
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): APIError {
    const message = handleAPIError(error);
    const statusCode = error.response?.status;
    return new APIError(message, statusCode, error);
  }

  /**
   * Make GET request
   */
  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await retryOperation(
        () => this.client.get<T>(url, config),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Make POST request
   */
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Make PUT request
   */
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Make DELETE request
   */
  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

/**
 * Word API endpoints
 */
export const wordAPI = {
  /**
   * Get all words with translations and images
   */
  getAll: async () => {
    return apiService.get(API_ENDPOINTS.WORDS.GET_ALL);
  },

  /**
   * Get word by ID
   */
  getById: async (id: string) => {
    return apiService.get(
      API_ENDPOINTS.WORDS.GET_BY_ID.replace(':id', id),
    );
  },

  /**
   * Get words by category
   */
  getByCategory: async (category: string) => {
    return apiService.get(
      API_ENDPOINTS.WORDS.GET_BY_CATEGORY.replace(':category', category),
    );
  },

  /**
   * Search words
   */
  search: async (query: string) => {
    return apiService.get(API_ENDPOINTS.WORDS.SEARCH, {
      params: { filters: { name: { $contains: query } } },
    });
  },

  /**
   * Get favorite words
   */
  getFavorites: async () => {
    return apiService.get(API_ENDPOINTS.WORDS.GET_FAVORITES);
  },
};

/**
 * Auth API endpoints
 */
export const authAPI = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    return apiService.post(API_ENDPOINTS.AUTH.SIGN_IN, {
      identifier: email,
      password,
    });
  },

  /**
   * Sign up new user
   */
  signUp: async (email: string, password: string, username: string) => {
    return apiService.post(API_ENDPOINTS.AUTH.SIGN_UP, {
      email,
      password,
      username,
    });
  },

  /**
   * Request a password reset code to be sent to the user's email
   */
  forgotPassword: async (email: string) => {
    return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password using the code sent to the user's email
   */
  resetPassword: async (code: string, password: string, passwordConfirmation: string) => {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      code,
      password,
      passwordConfirmation,
    });
  },
};

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiService.get(API_ENDPOINTS.USERS.GET_PROFILE);
  },

  /**
   * Update user profile
   */
  updateProfile: async (id: string, data: any) => {
    return apiService.put(
      API_ENDPOINTS.USERS.UPDATE_PROFILE.replace(':id', id),
      data,
    );
  },

  /**
   * Update user password
   */
  updatePassword: async (currentPassword: string, password: string, passwordConfirmation: string) => {
    return apiService.post(API_ENDPOINTS.USERS.UPDATE_PASSWORD, {
      currentPassword,
      password,
      passwordConfirmation,
    });
  },
};
