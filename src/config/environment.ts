/**
 * Environment Configuration
 * Centralized configuration for API endpoints and settings
 */

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Get current environment
 */
const getCurrentEnvironment = (): Environment => {
  // In a real app, this would come from your build configuration
  return 'development';
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  development: {
    //baseURL: 'http://192.168.8.102:1337/',
    baseURL: 'https://italygoadmin.com/',
    timeout: 30000,
    retryAttempts: 3,
  },
  staging: {
    baseURL: 'http://13.203.220.7:5000/',
    timeout: 30000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.production.com/',
    timeout: 30000,
    retryAttempts: 3,
  },
};

/**
 * Get API configuration for current environment
 */
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env];
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: 'api/auth/local',
    SIGN_UP: 'api/auth/local/register',
    REFRESH: 'api/auth/refresh',
  },
  WORDS: {
    //GET_ALL: 'api/words',
    GET_BY_ID: 'api/words/:id',
    GET_BY_CATEGORY: 'api/words',
    SEARCH: 'api/words',
    GET_FAVORITES: 'api/words/favorites',
    GET_CATEGORIES: 'api/main-catgories',
    // GET_BY_CATEGORY: 'api/words?filters[categories][$eq]=:category',
    GET_ALL: 'api/words?populate=*',
  },
  USERS: {
    GET_PROFILE: 'api/users/me',
    UPDATE_PASSWORD: '/api/auth/change-password',
  },
} as const;

/**
 * Image base URL
 */
export const IMAGE_BASE_URL = 'http://172.20.10.6:1337';

/**
 * App constants
 */
export const APP_CONFIG = {
  APP_NAME: 'Italy Dictionary',
  VERSION: '1.0.0',
  LANGUAGES: ['Italian', 'English', 'Sinhala'],
  DEFAULT_LANGUAGE: 'Italian',
} as const;
