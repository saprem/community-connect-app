import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { selectPhoto } from '../../services/cameraService';
import { sendVisitorApprovalNotification } from '../../services/notifications';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

const PURPOSES = ['Personal Visit', 'Delivery', 'Maintenance', 'Service', 'Guest', 'Other'];

// Sample residents for flat selection
const SAMPLE_RESIDENTS = [
  { flatNumber: 'A-101', name: 'Saprem Shah', userId: 'user1', phone: '+91 98765 43210' },
  { flatNumber: 'A-102', name: 'Priya Sharma', userId: 'user2', phone: '+91 98765 43211' },
  { flatNumber: 'B-201', name: 'Rahul Kumar', userId: 'user3', phone: '+91 98765 43212' },
  { flatNumber: 'B-202', name: 'Anjali Patel', userId: 'user4', phone: '+91 98765 43213' },
  { flatNumber: 'C-301', name: 'Vikram Singh', userId: 'user5', phone: '+91 98765 43214' },
];

export default function AddVisitorScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Form state
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('Personal Visit');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const selectedResident = SAMPLE_RESIDENTS.find(r => r.flatNumber === selectedFlat);

  const handleTakePhoto = async () => {
    try {
      const photo = await selectPhoto();
      if (photo) {
        setPhotoUri(photo.uri);
        console.log('📸 Photo captured:', photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!visitorName || !visitorPhone || !selectedFlat) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!photoUri) {
      Alert.alert('Photo Required', 'Please take a visitor photo for security purposes', [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    if (visitorPhone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Create visitor data
      const visitorData = {
        id: Date.now().toString(),
        name: visitorName,
        phone: `+91${visitorPhone}`,
        purpose,
        vehicleNumber,
        photoUrl: photoUri,
        hostUserId: selectedResident?.userId || '',
        hostName: selectedResident?.name || '',
        hostFlatNumber: selectedFlat,
        hostPhone: selectedResident?.phone || '',
        status: 'pending' as const,
        expectedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        expectedDate: new Date().toISOString().split('T')[0],
        actualEntryTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        addedBy: 'security',
        securityUserId: user?.id || '',
        communityId: user?.communityId || 'default',
        createdAt: new Date().toISOString(),
      };

      // TODO: Save to Firebase Firestore
      console.log('💾 Visitor data:', visitorData);

      // Send notification to resident
      await sendVisitorApprovalNotification(
        selectedResident?.userId || '',
        {
          id: visitorData.id,
          name: visitorData.name,
          purpose: visitorData.purpose,
          photoUrl: visitorData.photoUrl,
        }
      );

      Alert.alert(
        'Visitor Added Successfully!',
        `Notification sent to ${selectedResident?.name}\nWaiting for approval...`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setVisitorName('');
              setVisitorPhone('');
              setPurpose('Personal Visit');
              setVehicleNumber('');
              setPhotoUri(null);
              setSelectedFlat('');
            },
          },
          {
            text: 'Go to Dashboard',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding visitor:', error);
      Alert.alert('Error', 'Failed to add visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Visitor Entry</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>Visitor Photo *</Text>
          {photoUri ? (
            <View>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleTakePhoto}>
                <Text style={styles.retakeButtonText}>📸 Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={handleTakePhoto}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.photoPlaceholderText}>Tap to Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Visitor Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter visitor's full name"
            value={visitorName}
            onChangeText={setVisitorName}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={visitorPhone}
              onChangeText={setVisitorPhone}
            />
          </View>

          <Text style={styles.label}>Resident Flat Number *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flatScroll}>
            {SAMPLE_RESIDENTS.map((resident) => (
              <TouchableOpacity
                key={resident.flatNumber}
                style={[
                  styles.flatChip,
                  selectedFlat === resident.flatNumber && styles.flatChipActive
                ]}
                onPress={() => setSelectedFlat(resident.flatNumber)}
              >
                <Text style={[
                  styles.flatChipText,
                  selectedFlat === resident.flatNumber && styles.flatChipTextActive
                ]}>
                  {resident.flatNumber}
                </Text>
                <Text style={[
                  styles.flatChipName,
                  selectedFlat === resident.flatNumber && styles.flatChipNameActive
                ]}>
                  {resident.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedResident && (
            <View style={styles.residentInfo}>
              <Text style={styles.residentInfoText}>
                📞 {selectedResident.phone}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Purpose of Visit *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.purposeScroll}>
            {PURPOSES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.purposeChip, purpose === p && styles.purposeChipActive]}
                onPress={() => setPurpose(p)}
              >
                <Text style={[styles.purposeText, purpose === p && styles.purposeTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Vehicle Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., MH12AB1234"
            value={vehicleNumber}
            onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
            autoCapitalize="characters"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              A notification will be sent to {selectedResident?.name || 'the resident'} for approval.
              The visitor can enter only after approval.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : '📤 Submit & Notify Resident'}
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
  photoSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  photoPlaceholder: {
    height: 250,
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  photoPlaceholderText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  photoPreview: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  retakeButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: '600',
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
  flatScroll: {
    marginBottom: Spacing.md,
  },
  flatChip: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  flatChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  flatChipText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  flatChipTextActive: {
    color: Colors.primary,
  },
  flatChipName: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  flatChipNameActive: {
    color: Colors.primary,
  },
  residentInfo: {
    backgroundColor: Colors.info + '10',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  residentInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  purposeScroll: {
    marginBottom: Spacing.md,
  },
  purposeChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  purposeChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  purposeText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  purposeTextActive: {
    color: Colors.surface,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '10',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
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
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
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
