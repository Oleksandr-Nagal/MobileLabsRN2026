import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Entry() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
});
