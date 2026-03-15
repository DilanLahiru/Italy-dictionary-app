/**
 * Hook Template: useStandardizedHook
 * 
 * This is a template showing the standard pattern for custom hooks in this project.
 * Copy and modify as needed for your use case.
 */

import { useCallback, useEffect, useState } from 'react';
import { logError } from '../utils/errorHandler';

/**
 * Return type for the custom hook
 */
interface UseStandardizedHookReturn {
  data: any | null;
  loading: boolean;
  error: Error | null;
  retry: () => Promise<void>;
}

/**
 * Custom Hook Template
 * 
 * @param dependency - Description of parameter
 * @returns Hook state and methods
 * 
 * @example
 * const { data, loading, error } = useStandardizedHook(param);
 */
export const useStandardizedHook = (
  dependency?: any,
): UseStandardizedHookReturn => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch data from API or perform async operation
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Your async operation here
      // const result = await someAPICall();
      // setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logError('useStandardizedHook', error, { dependency });
    } finally {
      setLoading(false);
    }
  }, [dependency]);

  /**
   * Fetch data on mount and when dependencies change
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Retry fetching data
   */
  const retry = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, retry };
};

/**
 * Best Practices:
 * 
 * 1. Always define return type interface
 * 2. Use useCallback for functions to prevent unnecessary re-renders
 * 3. Include proper error handling with logError
 * 4. Document parameters and return values with JSDoc
 * 5. Provide example usage in @example
 * 6. Use proper TypeScript typing
 * 7. Handle loading and error states
 * 8. Cleanup effects if needed (return cleanup function from useEffect)
 * 9. Keep hooks focused on single responsibility
 * 10. Export individual hooks, not default exports
 */
