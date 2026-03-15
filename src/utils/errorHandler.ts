/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

/**
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Log error with context
 * @param context - Where the error occurred
 * @param error - The error object
 * @param metadata - Additional metadata
 */
export const logError = (
  context: string,
  error: any,
  metadata?: Record<string, any>,
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(
    `[${context}] Error: ${errorMessage}`,
    metadata ? `\nMetadata: ${JSON.stringify(metadata)}` : '',
    errorStack ? `\nStack: ${errorStack}` : '',
  );
};

/**
 * Handle and format API errors
 * @param error - The error from API call
 * @returns Formatted error message
 */
export const handleAPIError = (error: any): string => {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error.response) {
    const { status, data } = error.response;
    return data?.message || `API Error (${status}): ${error.message}`;
  }

  if (error.request) {
    return 'Network error: Unable to reach server';
  }

  return error.message || 'An unexpected error occurred';
};

/**
 * Retry logic for async operations
 * @param operation - The async operation to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Delay between retries in milliseconds
 * @returns Result of the operation
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
};
