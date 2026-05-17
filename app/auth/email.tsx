import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function EmailAuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (isSignUp && phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, phone);
        Alert.alert('Success', 'Account created! Please verify your email.');
      } else {
        await signInWithEmail(email, password);
      }
      router.replace('/auth/profile-setup');
    } catch (error) {
      Alert.alert('Error', isSignUp ? 'Sign up failed' : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {isSignUp && (
          <>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </>
        )}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isSignUp && (
          <>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </>
        )}

        {!isSignUp && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleLink}>
              {isSignUp ? ' Sign In' : ' Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Phone Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: 60,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSizes.md,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countryCode: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: FontSizes.md,
    padding: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  toggleText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  toggleLink: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
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
