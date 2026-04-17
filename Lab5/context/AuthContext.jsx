import { createContext, useContext, useMemo, useState } from 'react';
import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: (email, password) => {
        const errors = {
          email: validateEmail(email),
          password: validatePassword(password),
        };
        if (errors.email || errors.password) {
          return { ok: false, errors };
        }
        const trimmed = email.trim();
        setUser({ email: trimmed, name: trimmed.split('@')[0] });
        return { ok: true };
      },
      register: (email, password, name, confirm) => {
        const errors = {
          name: validateName(name),
          email: validateEmail(email),
          password: validatePassword(password),
          confirm: validateConfirm(password, confirm),
        };
        if (errors.name || errors.email || errors.password || errors.confirm) {
          return { ok: false, errors };
        }
        setUser({ email: email.trim(), name: name.trim() });
        return { ok: true };
      },
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
