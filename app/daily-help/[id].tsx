import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { updateHelper, deleteHelper } from '../../services/firestoreHelpers';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function HelperDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [helper, setHelper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHelper();
  }, [id]);

  const loadHelper = async () => {
    try {
      if (!db || !id) {
        // Mock data for development
        setHelper({
          id: id,
          name: 'Sample Helper',
          phone: '+91 98765 43210',
          category: 'Maids',
          experience: '3',
          salary: '10000',
          rating: 4.5,
          jobsCompleted: 12,
          available: true,
          address: 'Local area',
          notes: 'Experienced and reliable',
        });
        setLoading(false);
        return;
      }

      const helperDoc = await getDoc(doc(db, 'helpers', id as string));
      if (helperDoc.exists()) {
        setHelper({ id: helperDoc.id, ...helperDoc.data() });
      }
    } catch (error) {
      console.error('Error loading helper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (helper?.phone) {
      Linking.openURL(`tel:${helper.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (helper?.phone) {
      const phoneNumber = helper.phone.replace(/\D/g, '');
      Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await updateHelper(id as string, {
        available: !helper.available,
      });
      setHelper({ ...helper, available: !helper.available });
      Alert.alert('Success', `Helper marked as ${!helper.available ? 'available' : 'unavailable'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Helper',
      'Are you sure you want to delete this helper? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHelper(id as string);
              Alert.alert('Success', 'Helper deleted successfully', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete helper');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!helper) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Helper not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helper Details</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{helper.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{helper.name}</Text>
        <Text style={styles.category}>{helper.category}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>⭐ {helper.rating || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>🏠 {helper.jobsCompleted || '0'}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>📅 {helper.experience || '0'}Y</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <DetailRow icon="📱" label="Phone" value={helper.phone} />
        <DetailRow icon="📍" label="Address" value={helper.address || 'Not provided'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Details</Text>
        <DetailRow icon="💼" label="Category" value={helper.category} />
        <DetailRow icon="📅" label="Experience" value={`${helper.experience || '0'} years`} />
        <DetailRow icon="💰" label="Salary" value={`₹${helper.salary || '0'}/month`} />
        <DetailRow
          icon="✅"
          label="Availability"
          value={helper.available ? 'Available' : 'Not Available'}
          valueColor={helper.available ? Colors.success : Colors.danger}
        />
      </View>

      {helper.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.notes}>{helper.notes}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.toggleButton]}
          onPress={handleToggleAvailability}
        >
          <Text style={styles.bottomButtonText}>
            Mark as {helper.available ? 'Unavailable' : 'Available'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.deleteBottomButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.bottomButtonText, styles.deleteText]}>Delete Helper</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const DetailRow = ({ icon, label, value, valueColor }: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  deleteButton: {
    fontSize: 24,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    alignItems: 'center',
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
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  category: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  actionText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  notes: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  bottomActions: {
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  bottomButton: {
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: Colors.warning,
  },
  deleteBottomButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.danger,
  },
  bottomButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  deleteText: {
    color: Colors.danger,
  },
});
