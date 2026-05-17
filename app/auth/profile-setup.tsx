import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [block, setBlock] = useState('');
  const [role, setRole] = useState<'owner' | 'tenant'>('owner');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !communityId || !flatNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name,
        communityId,
        role,
        verified: false, // Will be verified by admin
      });
      Alert.alert(
        'Profile Created',
        'Your profile has been submitted for verification. You will be notified once approved.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us set up your community account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>MyGate Community ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 270950"
          keyboardType="number-pad"
          value={communityId}
          onChangeText={setCommunityId}
        />
        <Text style={styles.hint}>
          Find your community ID in MyGate settings or ask your society admin
        </Text>

        <Text style={styles.label}>Block/Tower</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Block A, Tower 1"
          value={block}
          onChangeText={setBlock}
        />

        <Text style={styles.label}>Flat/Unit Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 101, A-502"
          value={flatNumber}
          onChangeText={setFlatNumber}
        />

        <Text style={styles.label}>I am a *</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'owner' && styles.roleButtonActive]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>
              🏠 Owner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'tenant' && styles.roleButtonActive]}
            onPress={() => setRole('tenant')}
          >
            <Text style={[styles.roleText, role === 'tenant' && styles.roleTextActive]}>
              🔑 Tenant
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your profile will be verified by your society admin before you can access all features
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  icon: {
    fontSize: 60,
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
  hint: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  roleTextActive: {
    color: Colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '10',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
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
});
