import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [communityId, setCommunityId] = useState(user?.communityId || '');
  const [flatNumber, setFlatNumber] = useState('');
  const [block, setBlock] = useState('');
  const [role, setRole] = useState<'owner' | 'tenant'>(user?.role || 'owner');

  useEffect(() => {
    // Reset form when user changes
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setCommunityId(user?.communityId || '');
  }, [user]);

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name,
        email,
        role,
        communityId,
      });
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setCommunityId(user?.communityId || '');
    setRole(user?.role || 'owner');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity onPress={() => isEditing ? handleCancel() : setIsEditing(true)}>
          <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <FormField
            label="Full Name"
            value={name}
            onChangeText={setName}
            editable={isEditing}
            required
          />

          <FormField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            editable={false} // Phone number shouldn't be editable
            keyboardType="phone-pad"
          />

          <FormField
            label="Community ID"
            value={communityId}
            onChangeText={setCommunityId}
            editable={isEditing}
            keyboardType="number-pad"
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Flat Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              placeholder="Enter flat number"
              value={flatNumber}
              onChangeText={setFlatNumber}
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Block/Tower</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              placeholder="Enter block or tower"
              value={block}
              onChangeText={setBlock}
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'owner' && styles.roleButtonActive,
                  !isEditing && styles.roleButtonDisabled
                ]}
                onPress={() => isEditing && setRole('owner')}
                disabled={!isEditing}
              >
                <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>
                  🏠 Owner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'tenant' && styles.roleButtonActive,
                  !isEditing && styles.roleButtonDisabled
                ]}
                onPress={() => isEditing && setRole('tenant')}
                disabled={!isEditing}
              >
                <Text style={[styles.roleText, role === 'tenant' && styles.roleTextActive]}>
                  🔑 Tenant
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTitle}>Account Information</Text>
          <InfoRow label="Account Status" value={user?.verified ? '✅ Verified' : '⏳ Pending Verification'} />
          <InfoRow label="Member Since" value="January 2024" />
          <InfoRow label="User ID" value={user?.id || 'N/A'} />
        </View>
      </ScrollView>
    </View>
  );
}

const FormField = ({ label, value, onChangeText, editable, required, ...props }: any) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      placeholder={`Enter ${label.toLowerCase()}`}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      {...props}
    />
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  editButton: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  changePhotoButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  changePhotoText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  form: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.danger,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  inputDisabled: {
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
    backgroundColor: Colors.background,
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
  roleButtonDisabled: {
    opacity: 0.6,
  },
  roleText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  roleTextActive: {
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  accountInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  accountInfoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
});
