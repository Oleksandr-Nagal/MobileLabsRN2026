import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validation';

const VALIDATORS = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
};

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({ name: null, email: null, password: null, confirm: null });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });

  const validateField = (field, next) => {
    let error;
    if (field === 'confirm') {
      error = validateConfirm(next.password, next.confirm);
    } else {
      error = VALIDATORS[field](next[field]);
    }
    setErrors((prev) => {
      const updated = { ...prev, [field]: error };
      if (field === 'password' && touched.confirm) {
        updated.confirm = validateConfirm(next.password, next.confirm);
      }
      return updated;
    });
  };

  const onChange = (field, value) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) validateField(field, next);
  };

  const onBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, values);
  };

  const onSubmit = () => {
    setTouched({ name: true, email: true, password: true, confirm: true });
    const result = register(values.email, values.password, values.name, values.confirm);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Створення акаунту</Text>
          <Text style={styles.subtitle}>Заповніть форму, щоб почати покупки</Text>

          <Text style={styles.label}>Ім'я</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={values.name}
            onChangeText={(v) => onChange('name', v)}
            onBlur={() => onBlur('name')}
            placeholder="Іван Петренко"
            placeholderTextColor="#94a3b8"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={values.email}
            onChangeText={(v) => onChange('email', v)}
            onBlur={() => onBlur('email')}
            placeholder="user@example.com"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={values.password}
            onChangeText={(v) => onChange('password', v)}
            onBlur={() => onBlur('password')}
            placeholder="мінімум 8 символів"
            placeholderTextColor="#94a3b8"
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.label}>Підтвердження паролю</Text>
          <TextInput
            style={[styles.input, errors.confirm && styles.inputError]}
            value={values.confirm}
            onChangeText={(v) => onChange('confirm', v)}
            onBlur={() => onBlur('confirm')}
            placeholder="повторіть пароль"
            placeholderTextColor="#94a3b8"
            secureTextEntry
          />
          {errors.confirm ? <Text style={styles.errorText}>{errors.confirm}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={onSubmit}
          >
            <Text style={styles.buttonText}>Зареєструватися</Text>
          </Pressable>

          <Link href="/login" style={styles.link}>
            Вже є акаунт? Увійти
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
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 12 },
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
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});
