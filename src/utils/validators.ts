const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,}$/;

export const MIN_PASSWORD_LENGTH = 8;
export const OTP_LENGTH = 6;

export const isEmail = (value: string) => EMAIL_RE.test(value.trim());
export const isPhone = (value: string) => PHONE_RE.test(value.trim());
export const isFilled = (value: string) => value.trim().length > 0;
export const isStrongEnough = (value: string) =>
  value.length >= MIN_PASSWORD_LENGTH;

export type FieldError = { key: string; params?: Record<string, string> } | null;

export const required = (value: string, field: string): FieldError =>
  isFilled(value) ? null : { key: "validation.required", params: { field } };

export const email = (value: string, field: string): FieldError =>
  required(value, field) ??
  (isEmail(value) ? null : { key: "validation.invalidEmail" });

export const password = (value: string, field: string): FieldError =>
  required(value, field) ??
  (isStrongEnough(value) ? null : { key: "validation.passwordTooShort" });

export const matches = (value: string, other: string): FieldError =>
  value === other ? null : { key: "validation.passwordMismatch" };

export const phone = (value: string, field: string): FieldError =>
  required(value, field) ??
  (isPhone(value) ? null : { key: "validation.invalidPhone" });

export const otp = (value: string): FieldError =>
  value.length === OTP_LENGTH ? null : { key: "validation.otpIncomplete" };
