/**
 * Custom hook for reset password form state management
 */

import { useState, useCallback } from 'react';

interface ResetPasswordFormState {
  code: string;
  password: string;
  confirmPassword: string;
  errors: {
    code?: string;
    password?: string;
    confirmPassword?: string;
  };
  isLoading: boolean;
}

interface UseResetPasswordFormReturn {
  state: ResetPasswordFormState;
  setCode: (code: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setErrors: (errors: Partial<ResetPasswordFormState['errors']>) => void;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState: ResetPasswordFormState = {
  code: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isLoading: false,
};

export const useResetPasswordForm = (): UseResetPasswordFormReturn => {
  const [state, setState] = useState<ResetPasswordFormState>(initialState);

  const setCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, code, errors: { ...prev.errors, code: undefined } }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password, errors: { ...prev.errors, password: undefined } }));
  }, []);

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    setState((prev) => ({
      ...prev,
      confirmPassword,
      errors: { ...prev.errors, confirmPassword: undefined },
    }));
  }, []);

  const setErrors = useCallback((errors: Partial<ResetPasswordFormState['errors']>) => {
    setState((prev) => ({ ...prev, errors: { ...prev.errors, ...errors } }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const isFormValid = useCallback(() => {
    return (
      state.code.length > 0 &&
      state.password.length > 0 &&
      state.confirmPassword.length > 0 &&
      !state.errors.code &&
      !state.errors.password &&
      !state.errors.confirmPassword
    );
  }, [state]);

  return {
    state,
    setCode,
    setPassword,
    setConfirmPassword,
    setErrors,
    setIsLoading,
    resetForm,
    isFormValid,
  };
};
