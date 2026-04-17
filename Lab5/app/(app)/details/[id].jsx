import { Link, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { products } from '../../../data/products';

function formatPrice(price) {
  return `${price.toLocaleString('uk-UA')} ₴`;
}

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === String(id));

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Товар не знайдено</Text>
        <Text style={styles.notFoundText}>id: {String(id)}</Text>
        <Link href="/(app)" asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>На головну</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Опис</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Pressable style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.btnText}>Додати в кошик</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { paddingBottom: 24 },
  image: { width: '100%', height: 280, backgroundColor: '#e2e8f0' },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  price: { fontSize: 24, fontWeight: '800', color: '#16a34a', marginTop: 8 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  description: { fontSize: 15, lineHeight: 22, color: '#334155' },
  btn: {
    marginTop: 24,
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  notFoundTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  notFoundText: { color: '#64748b', marginTop: 6, marginBottom: 16 },
});
