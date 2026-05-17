import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { createPayment } from '../../services/firestoreHelpers';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

const CATEGORIES = ['Maintenance', 'Security', 'Utilities', 'Parking', 'Club House', 'Event', 'Other'];

export default function AddPaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [category, setCategory] = useState('Maintenance');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category || !amount || !description || !dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await createPayment({
        userId: user?.id || 'unknown',
        userName: user?.name || 'Unknown',
        amount: amountNum,
        category,
        description,
        dueDate,
        status: 'pending',
        communityId: user?.communityId || 'default',
      });

      Alert.alert('Success', 'Payment entry created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding payment:', error);
      Alert.alert('Error', 'Failed to add payment. Please try again.');
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
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Create a payment entry for community members. They will be notified and can pay via UPI.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Amount (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., Monthly maintenance charges"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Due Date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (e.g., 2024-06-30)"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <Text style={styles.hint}>Format: YYYY-MM-DD</Text>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Create Payment Entry'}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  categoryScroll: {
    marginBottom: Spacing.md,
  },
  categoryChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  categoryTextActive: {
    color: Colors.surface,
    fontWeight: '600',
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
