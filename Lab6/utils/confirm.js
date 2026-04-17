import { Alert, Platform } from 'react-native';

export function confirmDestructive(title, message, confirmLabel = 'Підтвердити') {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const result =
        typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`);
      resolve(Boolean(result));
      return;
    }
    Alert.alert(title, message, [
      { text: 'Скасувати', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
