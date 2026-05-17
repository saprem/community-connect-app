import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

const RELATIONSHIPS = [
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother',
  'Other',
];

export default function AddMemberScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (parseInt(age) < 0 || parseInt(age) > 150) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    setLoading(true);
    try {
      // TODO: Save to Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Success', 'Family member added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'Failed to add family member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRelationshipIcon = (rel: string) => {
    const icons: { [key: string]: string } = {
      'Spouse': '💑',
      'Son': '👦',
      'Daughter': '👧',
      'Father': '👨',
      'Mother': '👩',
      'Brother': '👦',
      'Sister': '👧',
      'Grandfather': '👴',
      'Grandmother': '👵',
      'Other': '👤',
    };
    return icons[rel] || '👤';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Family Member</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Relationship *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relationshipScroll}>
            {RELATIONSHIPS.map((rel) => (
              <TouchableOpacity
                key={rel}
                style={[styles.relationshipChip, relationship === rel && styles.relationshipChipActive]}
                onPress={() => setRelationship(rel)}
              >
                <Text style={styles.relationshipIcon}>{getRelationshipIcon(rel)}</Text>
                <Text style={[styles.relationshipText, relationship === rel && styles.relationshipTextActive]}>
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            keyboardType="number-pad"
            maxLength={3}
            value={age}
            onChangeText={setAge}
          />

          <Text style={styles.label}>Phone Number (Optional)</Text>
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

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Adding family members helps security identify them during gate entry and visitor management
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Family Member'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: Spacing.xxl,
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
  content: {
    flex: 1,
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
  relationshipScroll: {
    marginBottom: Spacing.md,
  },
  relationshipChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  relationshipChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  relationshipIcon: {
    fontSize: 20,
  },
  relationshipText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  relationshipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
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
