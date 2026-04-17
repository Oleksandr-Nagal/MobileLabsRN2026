const MAP = {
  'auth/invalid-email': 'Невірний формат email',
  'auth/user-disabled': 'Обліковий запис деактивовано',
  'auth/user-not-found': 'Користувача не знайдено',
  'auth/wrong-password': 'Невірний пароль',
  'auth/invalid-credential': 'Невірний email або пароль',
  'auth/email-already-in-use': 'Email вже використовується',
  'auth/weak-password': 'Пароль занадто слабкий (мінімум 6 символів)',
  'auth/network-request-failed': 'Помилка мережі. Перевірте з\u0027єднання',
  'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше',
  'auth/requires-recent-login': 'Потрібна повторна автентифікація',
  'auth/missing-password': 'Введіть пароль',
};

export function friendlyAuthError(err) {
  if (!err) return 'Невідома помилка';
  const code = err.code ?? '';
  return MAP[code] ?? err.message ?? 'Сталася помилка';
}
