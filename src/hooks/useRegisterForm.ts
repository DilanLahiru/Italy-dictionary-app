/**
 * Custom hook for register form state management
 */

import { useState, useCallback } from 'react';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  };
  isLoading: boolean;
}

interface UseRegisterFormReturn {
  state: RegisterFormState;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  setErrors: (errors: Partial<RegisterFormState['errors']>) => void;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
  errors: {},
  isLoading: false,
};

export const useRegisterForm = (): UseRegisterFormReturn => {
  const [state, setState] = useState<RegisterFormState>(initialState);

  const setName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name, errors: { ...prev.errors, name: undefined } }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, errors: { ...prev.errors, email: undefined } }));
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

  const setAgreedToTerms = useCallback((agreedToTerms: boolean) => {
    setState((prev) => ({ ...prev, agreedToTerms, errors: { ...prev.errors, terms: undefined } }));
  }, []);

  const setErrors = useCallback((errors: Partial<RegisterFormState['errors']>) => {
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
      state.name.length > 0 &&
      state.email.length > 0 &&
      state.password.length > 0 &&
      state.confirmPassword.length > 0 &&
      state.agreedToTerms &&
      !state.errors.name &&
      !state.errors.email &&
      !state.errors.password &&
      !state.errors.confirmPassword &&
      !state.errors.terms
    );
  }, [state]);

  return {
    state,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAgreedToTerms,
    setErrors,
    setIsLoading,
    resetForm,
    isFormValid,
  };
};
