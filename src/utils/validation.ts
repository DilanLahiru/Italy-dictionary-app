/**
 * Email validation utility
 */

export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return 'Email is required';
  }

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password.trim()) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Name is required';
  }

  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }

  return undefined;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | undefined => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return undefined;
};

