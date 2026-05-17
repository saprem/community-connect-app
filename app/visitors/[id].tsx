import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { updateVisitor, deleteVisitor } from '../../services/firestoreHelpers';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface Visitor {
  id: string;
  hostUserId: string;
  hostName: string;
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  expectedDate: string;
  expectedTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out';
  qrCode: string;
  communityId: string;
  createdAt?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export default function VisitorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisitor();
  }, [id]);

  const loadVisitor = async () => {
    try {
      if (!db || !id) {
        // Mock data for development
        setVisitor({
          id: id as string,
          hostUserId: 'user123',
          hostName: 'John Doe',
          name: 'Sample Visitor',
          phone: '+91 98765 43210',
          purpose: 'Personal Visit',
          vehicleNumber: 'MH12AB1234',
          expectedDate: new Date().toISOString(),
          expectedTime: '2:00 PM',
          status: 'pending',
          qrCode: 'VISITOR-12345',
          communityId: 'default',
        });
        setLoading(false);
        return;
      }

      const visitorDoc = await getDoc(doc(db, 'visitors', id as string));
      if (visitorDoc.exists()) {
        setVisitor({ id: visitorDoc.id, ...visitorDoc.data() } as Visitor);
      }
    } catch (error) {
      console.error('Error loading visitor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (visitor?.phone) {
      Linking.openURL(`tel:${visitor.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (visitor?.phone) {
      const phoneNumber = visitor.phone.replace(/\D/g, '');
      Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
    }
  };

  const handleApprove = async () => {
    Alert.alert(
      'Approve Visitor',
      'Allow this visitor to enter the community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await updateVisitor(id as string, {
                status: 'approved',
              });
              setVisitor({ ...visitor!, status: 'approved' });
              Alert.alert('Success', 'Visitor has been approved for entry');
            } catch (error) {
              Alert.alert('Error', 'Failed to approve visitor');
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Visitor',
      'Deny entry to this visitor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateVisitor(id as string, {
                status: 'rejected',
              });
              setVisitor({ ...visitor!, status: 'rejected' });
              Alert.alert('Success', 'Visitor entry has been rejected');
            } catch (error) {
              Alert.alert('Error', 'Failed to reject visitor');
            }
          },
        },
      ]
    );
  };

  const handleCheckIn = async () => {
    try {
      await updateVisitor(id as string, {
        status: 'checked-in',
        checkInTime: new Date().toISOString(),
      });
      setVisitor({
        ...visitor!,
        status: 'checked-in',
        checkInTime: new Date().toISOString()
      });
      Alert.alert('Success', 'Visitor has checked in');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in visitor');
    }
  };

  const handleCheckOut = async () => {
    try {
      await updateVisitor(id as string, {
        status: 'checked-out',
        checkOutTime: new Date().toISOString(),
      });
      setVisitor({
        ...visitor!,
        status: 'checked-out',
        checkOutTime: new Date().toISOString()
      });
      Alert.alert('Success', 'Visitor has checked out');
    } catch (error) {
      Alert.alert('Error', 'Failed to check out visitor');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Visitor',
      'Are you sure you want to delete this visitor entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVisitor(id as string);
              Alert.alert('Success', 'Visitor entry deleted', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete visitor');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.success;
      case 'rejected': return Colors.danger;
      case 'checked-in': return Colors.info;
      case 'checked-out': return Colors.textSecondary;
      default: return Colors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pending Approval';
      case 'approved': return '✅ Approved';
      case 'rejected': return '❌ Rejected';
      case 'checked-in': return '🏠 Checked In';
      case 'checked-out': return '👋 Checked Out';
      default: return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!visitor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Visitor not found</Text>
      </View>
    );
  }

  const isHost = user?.id === visitor.hostUserId;
  const isSecurity = user?.role === 'security' || user?.role === 'admin';
  const canApprove = isHost || isSecurity;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitor Details</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Status Badge */}
      <View style={styles.statusBanner}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(visitor.status) }]}>
          <Text style={styles.statusText}>{getStatusText(visitor.status)}</Text>
        </View>
      </View>

      {/* Visitor Card */}
      <View style={styles.visitorCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{visitor.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{visitor.name}</Text>
        <Text style={styles.purpose}>{visitor.purpose}</Text>

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

      {/* QR Code Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entry QR Code</Text>
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodePlaceholder}>📱</Text>
          <Text style={styles.qrCodeText}>{visitor.qrCode}</Text>
          <Text style={styles.qrHint}>Show this code at the gate</Text>
        </View>
      </View>

      {/* Visitor Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visit Information</Text>
        <DetailRow icon="👤" label="Host" value={visitor.hostName} />
        <DetailRow icon="📱" label="Phone" value={visitor.phone} />
        <DetailRow icon="📝" label="Purpose" value={visitor.purpose} />
        {visitor.vehicleNumber && (
          <DetailRow icon="🚗" label="Vehicle" value={visitor.vehicleNumber} />
        )}
        <DetailRow icon="📅" label="Expected Date" value={visitor.expectedDate} />
        <DetailRow icon="⏰" label="Expected Time" value={visitor.expectedTime} />
      </View>

      {/* Timeline */}
      {(visitor.checkInTime || visitor.checkOutTime) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {visitor.checkInTime && (
            <DetailRow
              icon="🔓"
              label="Checked In"
              value={formatDateTime(visitor.checkInTime)}
            />
          )}
          {visitor.checkOutTime && (
            <DetailRow
              icon="🔒"
              label="Checked Out"
              value={formatDateTime(visitor.checkOutTime)}
            />
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.bottomActions}>
        {canApprove && visitor.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.bottomButton, styles.approveButton]}
              onPress={handleApprove}
            >
              <Text style={styles.bottomButtonText}>✓ Approve Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomButton, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={[styles.bottomButtonText, styles.rejectText]}>✗ Reject Entry</Text>
            </TouchableOpacity>
          </>
        )}

        {isSecurity && visitor.status === 'approved' && (
          <TouchableOpacity
            style={[styles.bottomButton, styles.checkInButton]}
            onPress={handleCheckIn}
          >
            <Text style={styles.bottomButtonText}>Check In Visitor</Text>
          </TouchableOpacity>
        )}

        {isSecurity && visitor.status === 'checked-in' && (
          <TouchableOpacity
            style={[styles.bottomButton, styles.checkOutButton]}
            onPress={handleCheckOut}
          >
            <Text style={styles.bottomButtonText}>Check Out Visitor</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.bottomButton, styles.deleteBottomButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.bottomButtonText, styles.deleteText]}>Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  statusBanner: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  visitorCard: {
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
  purpose: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
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
  qrCodeContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  qrCodePlaceholder: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  qrCodeText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  qrHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
  approveButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.danger,
  },
  checkInButton: {
    backgroundColor: Colors.info,
  },
  checkOutButton: {
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
  rejectText: {
    color: Colors.danger,
  },
  deleteText: {
    color: Colors.danger,
  },
});
