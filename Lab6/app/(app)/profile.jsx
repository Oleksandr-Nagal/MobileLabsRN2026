import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { loadProfile, saveProfile } from '../../services/profile';
import {
  validateAge,
  validateCity,
  validateName,
} from '../../utils/validation';

export default function ProfileScreen() {
  const { uid } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState({ name: null, age: null, city: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!uid) return;
      try {
        const data = await loadProfile(uid);
        if (!active || !data) return;
        setName(data.name ?? '');
        setAge(data.age ? String(data.age) : '');
        setCity(data.city ?? '');
      } catch (err) {
        if (active) setServerError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [uid]);

  const onSubmit = async () => {
    const next = {
      name: validateName(name),
      age: validateAge(age),
      city: validateCity(city),
    };
    setErrors(next);
    if (next.name || next.age || next.city) return;

    setServerError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await saveProfile(uid, { name, age, city });
      setSuccess(true);
      setTimeout(() => router.replace('/(app)'), 600);
    } catch (err) {
      setServerError(err.message ?? 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Персональні дані</Text>
          <Text style={styles.subtitle}>
            Зберігаються у Firestore у документі з вашим UID
          </Text>

          <Text style={styles.label}>Ім'я</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Олександр"
            placeholderTextColor="#94a3b8"
            editable={!saving}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.label}>Вік</Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            value={age}
            onChangeText={setAge}
            placeholder="25"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            editable={!saving}
          />
          {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

          <Text style={styles.label}>Місто</Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            value={city}
            onChangeText={setCity}
            placeholder="Житомир"
            placeholderTextColor="#94a3b8"
            editable={!saving}
          />
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

          {success ? <Text style={styles.success}>Профіль збережено</Text> : null}
          {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              saving && styles.buttonDisabled,
            ]}
            onPress={onSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#f8fafc" />
            ) : (
              <Text style={styles.buttonText}>Зберегти</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
            disabled={saving}
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
  center: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
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
