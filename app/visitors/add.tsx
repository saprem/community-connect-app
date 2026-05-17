import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { createVisitor } from '../../services/firestoreHelpers';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function AddVisitorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone || !purpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const qrCode = `VISITOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await createVisitor({
        hostUserId: user?.id || 'unknown',
        hostName: user?.name || 'Unknown',
        name,
        phone: `+91${phone}`,
        purpose,
        vehicleNumber: vehicleNumber || undefined,
        expectedDate: expectedDate || new Date().toISOString(),
        expectedTime: expectedTime || 'Anytime',
        status: 'pending',
        qrCode,
        communityId: user?.communityId || 'default',
      });

      Alert.alert(
        'Success!',
        'Visitor entry created successfully. Security will be notified.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding visitor:', error);
      Alert.alert('Error', 'Failed to add visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Visitor</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Security will receive notification. Visitor can enter after approval.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Visitor Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter visitor's full name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number *</Text>
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

        <Text style={styles.label}>Purpose of Visit *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Personal visit, Delivery, Service"
          value={purpose}
          onChangeText={setPurpose}
        />

        <Text style={styles.label}>Vehicle Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., MH12AB1234"
          value={vehicleNumber}
          onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Expected Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Today / Tomorrow / DD-MM-YYYY"
          value={expectedDate}
          onChangeText={setExpectedDate}
        />

        <Text style={styles.label}>Expected Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2:00 PM or Anytime"
          value={expectedTime}
          onChangeText={setExpectedTime}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding...' : 'Add Visitor'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    fontSize: 28,
    color: Colors.text,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 28,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '20',
    padding: Spacing.md,
    margin: Spacing.lg,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  form: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
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
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
});
