import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function VisitorsTabScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the full visitors screen
    router.replace('/visitors' as any);
  }, []);

  // Show loading while redirecting
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
