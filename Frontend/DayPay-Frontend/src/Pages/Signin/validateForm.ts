import type { FormValues , FormErrors } from './FormValues'


export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const username = values.username.trim();
  const email = values.email.trim();

  if (!username) {
    errors.username = "Please enter a username.";
  } else if (username.length < 3 || username.length > 24) {
    errors.username = "Use 3–24 characters.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Use only letters, numbers, and underscores.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }


  if (!values.password) {
    errors.password = "Please create a password.";
  } else if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = "Add at least one lowercase letter.";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Add at least one uppercase letter.";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Add at least one number.";
  } else if (!/[^A-Za-z0-9]/.test(values.password)) {
    errors.password = "Add at least one special character.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}