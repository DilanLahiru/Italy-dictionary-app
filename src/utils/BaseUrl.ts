/**
 * Deprecated: Use apiService from services/apiService.ts instead
 * This file is kept for backwards compatibility
 */

import axios from 'axios';
import { getApiConfig, API_ENDPOINTS } from '../config/environment';

// Legacy support
export const BaseUrl = axios.create({
  baseURL: getApiConfig().baseURL,
});

export { API_ENDPOINTS as API_PATH } from '../config/environment';