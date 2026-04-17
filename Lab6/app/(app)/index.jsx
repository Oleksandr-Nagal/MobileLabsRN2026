import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { loadProfile } from '../../services/profile';
import { confirmDestructive } from '../../utils/confirm';

export default function HomeScreen() {
  const { user, uid, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        if (!uid) return;
        setLoading(true);
        setError(null);
        try {
          const data = await loadProfile(uid);
          if (active) setProfile(data);
        } catch (err) {
          if (active) setError(err.message ?? 'Помилка завантаження');
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [uid]),
  );

  const onLogout = async () => {
    const confirmed = await confirmDestructive(
      'Вихід',
      'Вийти з облікового запису?',
      'Вийти',
    );
    if (!confirmed) return;
    await logout();
    router.replace('/(auth)/login');
  };

  const hasProfile = profile?.name && profile?.age && profile?.city;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.hello}>Вітаємо</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Профіль</Text>
          <Link href="/(app)/profile" style={styles.editLink}>
            {hasProfile ? 'Редагувати' : 'Заповнити'}
          </Link>
        </View>

        {loading ? (
          <ActivityIndicator color="#0f172a" style={{ marginTop: 8 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : !hasProfile ? (
          <Text style={styles.muted}>
            Дані профілю ще не заповнені. Натисніть "Заповнити".
          </Text>
        ) : (
          <>
            <Row label="Ім'я" value={profile.name} />
            <Row label="Вік" value={String(profile.age)} />
            <Row label="Місто" value={profile.city} />
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Безпека</Text>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
          onPress={() => router.push('/(app)/change-password')}
        >
          <Text style={styles.secondaryBtnText}>Змінити пароль</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.dangerBtn, pressed && styles.pressed]}
          onPress={() => router.push('/(app)/delete-account')}
        >
          <Text style={styles.dangerBtnText}>Видалити акаунт</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
        onPress={onLogout}
      >
        <Text style={styles.logoutText}>Вийти</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hello: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  email: { fontSize: 18, color: '#0f172a', fontWeight: '700', marginTop: 4 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  editLink: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
  muted: { color: '#64748b', fontSize: 14, lineHeight: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLabel: { color: '#64748b', fontSize: 14 },
  rowValue: { color: '#0f172a', fontSize: 14, fontWeight: '600' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 15 },
  dangerBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerBtnText: { color: '#f8fafc', fontWeight: '700', fontSize: 15 },
  errorText: { color: '#dc2626', fontSize: 13, marginTop: 4 },
  logoutBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  pressed: { opacity: 0.85 },
  logoutText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
});
