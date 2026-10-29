export type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};


export type FieldName = keyof FormValues;
export type FormErrors = Partial<Record<FieldName, string>>;
export type ApiResponse = {
  message?: string;
  error?: string;
  field?: string;
  keyValue?: Record<string, unknown>;
};