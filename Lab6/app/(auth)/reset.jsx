import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { friendlyAuthError } from '../../firebase/errors';
import { validateEmail } from '../../utils/validation';

export default function ResetScreen() {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmit = async () => {
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError(null);
    setServerError(null);
    setSubmitting(true);
    try {
      await sendReset(email);
      setSent(true);
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
      <View style={styles.card}>
        <Text style={styles.title}>Скидання паролю</Text>
        <Text style={styles.subtitle}>
          Ми надішлемо посилання для відновлення на ваш email
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (error) setError(null);
          }}
          placeholder="user@example.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!submitting}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Лист надіслано ✓</Text>
            <Text style={styles.successText}>
              Перевірте поштову скриньку <Text style={styles.bold}>{email.trim()}</Text>.
            </Text>
            <Text style={styles.successHint}>
              Якщо листа немає протягом 1–2 хв — перевірте папку «Спам»/«Промоакції».
            </Text>
          </View>
        ) : null}
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
            <Text style={styles.buttonText}>
              {sent ? 'Надіслати ще раз' : 'Надіслати посилання'}
            </Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" style={styles.link}>
          Повернутись до входу
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    padding: 16,
  },
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
  successBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  successTitle: {
    color: '#047857',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  successText: {
    color: '#065f46',
    fontSize: 13,
    lineHeight: 18,
  },
  successHint: {
    color: '#065f46',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    fontStyle: 'italic',
  },
  bold: { fontWeight: '700' },
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
