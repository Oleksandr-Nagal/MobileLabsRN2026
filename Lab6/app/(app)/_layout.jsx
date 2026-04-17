import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Профіль' }} />
      <Stack.Screen name="profile" options={{ title: 'Редагування профілю' }} />
      <Stack.Screen name="change-password" options={{ title: 'Зміна паролю' }} />
      <Stack.Screen name="delete-account" options={{ title: 'Видалення акаунту' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
});
