/**
 * Custom hook for forgot password form state management
 */

import { useState, useCallback } from 'react';

interface ForgotPasswordFormState {
  email: string;
  errors: {
    email?: string;
  };
  isLoading: boolean;
}

interface UseForgotPasswordFormReturn {
  state: ForgotPasswordFormState;
  setEmail: (email: string) => void;
  setErrors: (errors: Partial<ForgotPasswordFormState['errors']>) => void;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState: ForgotPasswordFormState = {
  email: '',
  errors: {},
  isLoading: false,
};

export const useForgotPasswordForm = (): UseForgotPasswordFormReturn => {
  const [state, setState] = useState<ForgotPasswordFormState>(initialState);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, errors: { ...prev.errors, email: undefined } }));
  }, []);

  const setErrors = useCallback((errors: Partial<ForgotPasswordFormState['errors']>) => {
    setState((prev) => ({ ...prev, errors: { ...prev.errors, ...errors } }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const isFormValid = useCallback(() => {
    return state.email.length > 0 && !state.errors.email;
  }, [state]);

  return {
    state,
    setEmail,
    setErrors,
    setIsLoading,
    resetForm,
    isFormValid,
  };
};
