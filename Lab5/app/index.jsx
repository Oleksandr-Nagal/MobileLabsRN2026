import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Entry() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/login'} />;
}
