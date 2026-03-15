/**
 * Custom hook for login form state management
 */

import { useState, useCallback } from 'react';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  errors: {
    email?: string;
    password?: string;
  };
  isLoading: boolean;
}

interface UseLoginFormReturn {
  state: LoginFormState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRememberMe: (value: boolean) => void;
  setErrors: (errors: Partial<LoginFormState['errors']>) => void;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState: LoginFormState = {
  email: '',
  password: '',
  rememberMe: true,
  errors: {},
  isLoading: false,
};

export const useLoginForm = (): UseLoginFormReturn => {
  const [state, setState] = useState<LoginFormState>(initialState);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, errors: { ...prev.errors, email: undefined } }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password, errors: { ...prev.errors, password: undefined } }));
  }, []);

  const setRememberMe = useCallback((rememberMe: boolean) => {
    setState((prev) => ({ ...prev, rememberMe }));
  }, []);

  const setErrors = useCallback((errors: Partial<LoginFormState['errors']>) => {
    setState((prev) => ({ ...prev, errors: { ...prev.errors, ...errors } }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const isFormValid = useCallback(() => {
    return state.email.length > 0 && state.password.length > 0 && !state.errors.email && !state.errors.password;
  }, [state]);

  return {
    state,
    setEmail,
    setPassword,
    setRememberMe,
    setErrors,
    setIsLoading,
    resetForm,
    isFormValid,
  };
};
