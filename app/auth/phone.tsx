import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOTP } = useAuth();
  const router = useRouter();

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      await signInWithPhone(`+91${phone}`);
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(otp);
      router.replace('/auth/profile-setup');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>CC</Text>
        <Text style={styles.title}>Community Connect</Text>
        <Text style={styles.subtitle}>
          {otpSent ? 'Enter OTP sent to your phone' : 'Sign in with your phone number'}
        </Text>
      </View>

      <View style={styles.form}>
        {!otpSent ? (
          <>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setOtpSent(false);
                setOtp('');
              }}
            >
              <Text style={styles.resendText}>Change Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => router.push('/auth/google')}
      >
        <Text style={styles.googleButtonText}>🔍 Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.emailButton}
        onPress={() => router.push('/auth/email')}
      >
        <Text style={styles.emailButtonText}>📧 Sign in with Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    color: Colors.surface,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
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
  otpInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSizes.lg,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  resendText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  googleButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  emailButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emailButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
