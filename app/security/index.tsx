import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface Visitor {
  id: string;
  name: string;
  hostName: string;
  hostFlatNumber: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'entered' | 'exited';
  photoUrl?: string;
  actualEntryTime?: string;
  expectedTime: string;
}

// Sample data for testing
const SAMPLE_VISITORS: Visitor[] = [
  {
    id: '1',
    name: 'John Doe',
    hostName: 'Saprem Shah',
    hostFlatNumber: 'A-101',
    purpose: 'Personal Visit',
    status: 'pending',
    expectedTime: '10:30 AM',
  },
  {
    id: '2',
    name: 'Jane Smith',
    hostName: 'Priya Sharma',
    hostFlatNumber: 'B-205',
    purpose: 'Delivery',
    status: 'approved',
    expectedTime: '11:00 AM',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    hostName: 'Rahul Kumar',
    hostFlatNumber: 'C-301',
    purpose: 'Maintenance',
    status: 'entered',
    actualEntryTime: '09:15 AM',
    expectedTime: '09:00 AM',
  },
];

export default function SecurityDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>(SAMPLE_VISITORS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'entered'>('all');

  const loadVisitors = async () => {
    setLoading(true);
    try {
      // TODO: Load from Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
      setVisitors(SAMPLE_VISITORS);
    } catch (error) {
      console.error('Error loading visitors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadVisitors();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'approved': return Colors.success;
      case 'rejected': return Colors.danger;
      case 'entered': return Colors.info;
      case 'exited': return Colors.textSecondary;
      default: return Colors.text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'entered': return '🚪';
      case 'exited': return '👋';
      default: return '❓';
    }
  };

  const filteredVisitors = filter === 'all'
    ? visitors
    : visitors.filter(v => v.status === filter);

  const stats = {
    pending: visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    entered: visitors.filter(v => v.status === 'entered').length,
    total: visitors.length,
  };

  // Check if user is security
  if (user?.role !== 'security' && user?.role !== 'admin') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorIcon}>🔒</Text>
        <Text style={styles.errorTitle}>Access Denied</Text>
        <Text style={styles.errorText}>
          This section is only accessible to security personnel
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🔒 Security Dashboard</Text>
          <Text style={styles.headerSubtitle}>Today's Visitor Management</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/security/add-visitor' as any)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { borderLeftColor: Colors.warning }]}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.success }]}>
            <Text style={styles.statValue}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.info }]}>
            <Text style={styles.statValue}>{stats.entered}</Text>
            <Text style={styles.statLabel}>Inside</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['all', 'pending', 'approved', 'entered'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visitors List */}
        <View style={styles.visitorsList}>
          {filteredVisitors.length > 0 ? (
            filteredVisitors.map((visitor) => (
              <TouchableOpacity
                key={visitor.id}
                style={styles.visitorCard}
                onPress={() => router.push(`/visitors/${visitor.id}` as any)}
              >
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: getStatusColor(visitor.status) + '20' }]}>
                  <Text style={styles.avatarText}>{visitor.name.charAt(0).toUpperCase()}</Text>
                </View>

                {/* Info */}
                <View style={styles.visitorInfo}>
                  <Text style={styles.visitorName}>{visitor.name}</Text>
                  <Text style={styles.visitorHost}>
                    🏠 {visitor.hostFlatNumber} - {visitor.hostName}
                  </Text>
                  <Text style={styles.visitorPurpose}>
                    🎯 {visitor.purpose}
                  </Text>
                  <Text style={styles.visitorTime}>
                    ⏰ {visitor.actualEntryTime || visitor.expectedTime}
                  </Text>
                </View>

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(visitor.status) }]}>
                  <Text style={styles.statusIcon}>{getStatusIcon(visitor.status)}</Text>
                  <Text style={styles.statusText}>
                    {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No Visitors</Text>
              <Text style={styles.emptyText}>
                {filter === 'all'
                  ? 'No visitors registered today'
                  : `No ${filter} visitors`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/security/add-visitor' as any)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  addButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.surface,
  },
  visitorsList: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  visitorCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  visitorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  visitorName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  visitorHost: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  visitorPurpose: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  visitorTime: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  statusText: {
    fontSize: FontSizes.xs,
    color: Colors.surface,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: Colors.surface,
    fontWeight: 'bold',
  },
});
