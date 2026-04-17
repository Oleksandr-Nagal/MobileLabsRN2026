import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { friendlyAuthError } from '../../firebase/errors';
import {
  validateConfirm,
  validateEmail,
  validatePassword,
} from '../../utils/validation';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirm: null,
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const runValidation = (nextEmail, nextPassword, nextConfirm) => ({
    email: validateEmail(nextEmail),
    password: validatePassword(nextPassword),
    confirm: validateConfirm(nextPassword, nextConfirm),
  });

  const onBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(runValidation(email, password, confirm));
  };

  const onSubmit = async () => {
    setTouched({ email: true, password: true, confirm: true });
    const next = runValidation(email, password, confirm);
    setErrors(next);
    if (next.email || next.password || next.confirm) return;

    setServerError(null);
    setSubmitting(true);
    try {
      await register(email, password);
      router.replace('/(app)/profile');
    } catch (err) {
      setServerError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Створити акаунт</Text>
          <Text style={styles.subtitle}>
            Профіль ви зможете заповнити після реєстрації
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (touched.email) setErrors(runValidation(v, password, confirm));
            }}
            onBlur={() => onBlur('email')}
            placeholder="user@example.com"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!submitting}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (touched.password) setErrors(runValidation(email, v, confirm));
            }}
            onBlur={() => onBlur('password')}
            placeholder="мінімум 6 символів"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.label}>Підтвердження паролю</Text>
          <TextInput
            style={[styles.input, errors.confirm && styles.inputError]}
            value={confirm}
            onChangeText={(v) => {
              setConfirm(v);
              if (touched.confirm) setErrors(runValidation(email, password, v));
            }}
            onBlur={() => onBlur('confirm')}
            placeholder="повторіть пароль"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {errors.confirm ? <Text style={styles.errorText}>{errors.confirm}</Text> : null}

          {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              submitting && styles.buttonDisabled,
            ]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#f8fafc" />
            ) : (
              <Text style={styles.buttonText}>Зареєструватися</Text>
            )}
          </Pressable>

          <Link href="/(auth)/login" style={styles.link}>
            Вже маєте акаунт? Увійти
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 20 },
  label: { fontSize: 13, color: '#334155', marginBottom: 6, marginTop: 12, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  serverError: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});
