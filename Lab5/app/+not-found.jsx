import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Не знайдено', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Екран не знайдено</Text>
        <Text style={styles.subtitle}>
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        >
          <Text style={styles.btnText}>← Назад</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9',
  },
  code: { fontSize: 72, fontWeight: '800', color: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginTop: 8 },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 220,
    alignItems: 'center',
  },
  btnText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
});
