import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo/Icon Area */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>CC</Text>
        </View>
        <Text style={styles.title}>Community Connect</Text>
        <Text style={styles.subtitle}>Simplifying Community Living</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <FeatureItem icon="🚪" text="Visitor Management" />
        <FeatureItem icon="💬" text="Community Chat" />
        <FeatureItem icon="💰" text="Easy Payments" />
        <FeatureItem icon="🔔" text="Smart Notifications" />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/auth/phone')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Trusted by 500+ communities
      </Text>
    </View>
  );
}

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  featuresContainer: {
    marginVertical: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
  },
});
