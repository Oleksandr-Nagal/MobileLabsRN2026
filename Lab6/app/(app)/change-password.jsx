import { useRouter } from 'expo-router';
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
  validatePassword,
} from '../../utils/validation';

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({ current: null, next: null, confirm: null });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    const nextErrors = {
      current: current ? null : 'Введіть поточний пароль',
      next: validatePassword(next),
      confirm: validateConfirm(next, confirm),
    };
    setErrors(nextErrors);
    if (nextErrors.current || nextErrors.next || nextErrors.confirm) return;

    setServerError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setTimeout(() => router.back(), 800);
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
          <Text style={styles.title}>Зміна паролю</Text>
          <Text style={styles.subtitle}>
            Для безпеки потрібна повторна автентифікація
          </Text>

          <Text style={styles.label}>Поточний пароль</Text>
          <TextInput
            style={[styles.input, errors.current && styles.inputError]}
            value={current}
            onChangeText={setCurrent}
            placeholder="••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {errors.current ? <Text style={styles.errorText}>{errors.current}</Text> : null}

          <Text style={styles.label}>Новий пароль</Text>
          <TextInput
            style={[styles.input, errors.next && styles.inputError]}
            value={next}
            onChangeText={setNext}
            placeholder="мінімум 6 символів"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {errors.next ? <Text style={styles.errorText}>{errors.next}</Text> : null}

          <Text style={styles.label}>Підтвердження нового паролю</Text>
          <TextInput
            style={[styles.input, errors.confirm && styles.inputError]}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="повторіть новий пароль"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {errors.confirm ? <Text style={styles.errorText}>{errors.confirm}</Text> : null}

          {success ? <Text style={styles.success}>Пароль змінено</Text> : null}
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
              <Text style={styles.buttonText}>Змінити пароль</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.secondaryButtonText}>Скасувати</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { padding: 16 },
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
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 16 },
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
  success: {
    color: '#047857',
    fontSize: 14,
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
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: '#334155', fontWeight: '600', fontSize: 15 },
});
