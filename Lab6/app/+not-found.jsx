import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Не знайдено' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Сторінку не знайдено</Text>
        <Link href="/" style={styles.link}>
          На головну
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f1f5f9',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  link: { color: '#2563eb', fontWeight: '600', fontSize: 15 },
});
