import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Вхід' }} />
      <Stack.Screen name="register" options={{ title: 'Реєстрація' }} />
      <Stack.Screen name="reset" options={{ title: 'Відновлення паролю' }} />
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
