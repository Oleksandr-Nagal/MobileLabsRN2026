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
import { confirmDestructive } from '../../utils/confirm';

export default function DeleteAccountScreen() {
  const { verifyPassword, deleteAccount, user } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onDeletePressed = async () => {
    if (!password) {
      setError('Введіть пароль');
      return;
    }
    setError(null);
    setServerError(null);
    setSubmitting(true);

    try {
      await verifyPassword(password);
    } catch (err) {
      setServerError(friendlyAuthError(err));
      setSubmitting(false);
      return;
    }

    const confirmed = await confirmDestructive(
      'Видалити акаунт?',
      'Це незворотна дія. Всі ваші дані (профіль та обліковий запис) будуть безповоротно видалені.',
      'Видалити',
    );

    if (!confirmed) {
      setSubmitting(false);
      return;
    }

    try {
      await deleteAccount();
      router.replace('/(auth)/login');
    } catch (err) {
      setServerError(friendlyAuthError(err));
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
          <Text style={styles.title}>Видалення акаунту</Text>
          <Text style={styles.warning}>
            Всі ваші дані (профіль, обліковий запис) будуть видалені без можливості
            відновлення.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.readonlyInput]}
            value={user?.email ?? ''}
            editable={false}
          />

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (error) setError(null);
              if (serverError) setServerError(null);
            }}
            placeholder="Введіть поточний пароль"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!submitting}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.dangerButton,
              pressed && styles.buttonPressed,
              submitting && styles.buttonDisabled,
            ]}
            onPress={onDeletePressed}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#f8fafc" />
            ) : (
              <Text style={styles.dangerButtonText}>Видалити акаунт</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: '#dc2626' },
  warning: {
    fontSize: 14,
    color: '#991b1b',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
  },
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
  readonlyInput: { color: '#64748b', backgroundColor: '#f1f5f9' },
  inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  serverError: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.6 },
  dangerButtonText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
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
