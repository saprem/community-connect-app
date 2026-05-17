import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/phone" />
          <Stack.Screen name="auth/email" />
          <Stack.Screen name="auth/google" />
          <Stack.Screen name="auth/profile-setup" />
          <Stack.Screen name="daily-help/index" />
          <Stack.Screen name="daily-help/add" />
          <Stack.Screen name="daily-help/[id]" />
          <Stack.Screen name="visitors/index" />
          <Stack.Screen name="visitors/add" />
          <Stack.Screen name="visitors/[id]" />
          <Stack.Screen name="payments/index" />
          <Stack.Screen name="payments/add" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
