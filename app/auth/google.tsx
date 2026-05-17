import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function GoogleAuthScreen() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/auth/profile-setup');
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Sign in with Google</Text>
        <Text style={styles.subtitle}>
          Connect with your Google account for quick and secure access
        </Text>

        <TouchableOpacity
          style={[styles.googleButton, loading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✓ Quick & Secure</Text>
          <Text style={styles.infoText}>
            We'll never share your information without your permission
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to other options</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
    marginRight: Spacing.sm,
  },
  googleButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: Colors.success + '20',
    padding: Spacing.lg,
    borderRadius: 12,
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 300,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  backButton: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
