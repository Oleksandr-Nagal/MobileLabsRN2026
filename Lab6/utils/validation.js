const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN_LENGTH = 6;

export function validateEmail(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Email обов\u0027язковий';
  if (v.length > 254) return 'Email задовгий';
  if (!EMAIL_RE.test(v)) return 'Невірний формат email';
  return null;
}

export function validatePassword(value) {
  const v = value ?? '';
  if (!v) return 'Пароль обов\u0027язковий';
  if (v.length < PASSWORD_MIN_LENGTH) {
    return `Пароль має містити мінімум ${PASSWORD_MIN_LENGTH} символів`;
  }
  if (v.length > 72) return 'Пароль задовгий (макс. 72 символи)';
  return null;
}

export function validateName(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Ім\u0027я обов\u0027язкове';
  if (v.length < 2) return 'Ім\u0027я має містити мінімум 2 символи';
  if (v.length > 50) return 'Ім\u0027я задовге';
  return null;
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Підтвердіть пароль';
  if (password !== confirm) return 'Паролі не співпадають';
  return null;
}

export function validateAge(value) {
  const v = (value ?? '').toString().trim();
  if (!v) return 'Вік обов\u0027язковий';
  if (!/^\d+$/.test(v)) return 'Вік має бути числом';
  const n = Number(v);
  if (n < 1 || n > 120) return 'Введіть коректний вік (1-120)';
  return null;
}

export function validateCity(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Місто обов\u0027язкове';
  if (v.length < 2) return 'Назва міста занадто коротка';
  if (v.length > 80) return 'Назва міста задовга';
  return null;
}
