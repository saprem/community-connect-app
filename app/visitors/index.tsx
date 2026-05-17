import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { getVisitors } from '../../services/firestoreHelpers';
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
}

const SAMPLE_VISITORS: Visitor[] = [
  {
    id: '1',
    hostUserId: 'user123',
    hostName: 'John Doe',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    purpose: 'Personal Visit',
    vehicleNumber: 'MH12AB1234',
    expectedDate: 'Today',
    expectedTime: '2:00 PM',
    status: 'pending',
    qrCode: 'VISITOR-001',
    communityId: 'default',
  },
  {
    id: '2',
    hostUserId: 'user123',
    hostName: 'Jane Smith',
    name: 'Delivery Person',
    phone: '+91 98765 43211',
    purpose: 'Package Delivery',
    expectedDate: 'Today',
    expectedTime: 'Anytime',
    status: 'approved',
    qrCode: 'VISITOR-002',
    communityId: 'default',
  },
  {
    id: '3',
    hostUserId: 'user456',
    hostName: 'Bob Wilson',
    name: 'Service Technician',
    phone: '+91 98765 43212',
    purpose: 'AC Repair',
    vehicleNumber: 'MH14XY5678',
    expectedDate: 'Today',
    expectedTime: '10:00 AM',
    status: 'checked-in',
    qrCode: 'VISITOR-003',
    communityId: 'default',
  },
];

export default function VisitorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      if (user?.id) {
        const data = await getVisitors(user.id);
        setVisitors(data as Visitor[]);
      } else {
        // Mock data for development
        setVisitors(SAMPLE_VISITORS);
      }
    } catch (error) {
      console.error('Error loading visitors:', error);
      setVisitors(SAMPLE_VISITORS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVisitors();
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.success;
      case 'rejected': return Colors.danger;
      case 'checked-in': return Colors.info;
      case 'checked-out': return Colors.textSecondary;
      default: return Colors.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'checked-in': return '🏠';
      case 'checked-out': return '👋';
      default: return '📋';
    }
  };

  const pendingCount = visitors.filter(v => v.status === 'pending').length;
  const approvedCount = visitors.filter(v => v.status === 'approved').length;
  const checkedInCount = visitors.filter(v => v.status === 'checked-in').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitors</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.warning + '20' }]}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.success + '20' }]}>
            <Text style={styles.statNumber}>{approvedCount}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.info + '20' }]}>
            <Text style={styles.statNumber}>{checkedInCount}</Text>
            <Text style={styles.statLabel}>Checked In</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone, or purpose"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
              All ({visitors.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'pending' && styles.filterChipActive]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text style={[styles.filterText, filterStatus === 'pending' && styles.filterTextActive]}>
              ⏳ Pending ({pendingCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'approved' && styles.filterChipActive]}
            onPress={() => setFilterStatus('approved')}
          >
            <Text style={[styles.filterText, filterStatus === 'approved' && styles.filterTextActive]}>
              ✅ Approved ({approvedCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'checked-in' && styles.filterChipActive]}
            onPress={() => setFilterStatus('checked-in')}
          >
            <Text style={[styles.filterText, filterStatus === 'checked-in' && styles.filterTextActive]}>
              🏠 Checked In ({checkedInCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Visitors List */}
        <View style={styles.listContainer}>
          {filteredVisitors.length > 0 ? (
            filteredVisitors.map((visitor) => (
              <TouchableOpacity
                key={visitor.id}
                style={styles.visitorCard}
                onPress={() => router.push(`/visitors/${visitor.id}` as any)}
              >
                <View style={styles.visitorHeader}>
                  <View style={styles.visitorAvatar}>
                    <Text style={styles.visitorAvatarText}>
                      {visitor.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{visitor.name}</Text>
                    <Text style={styles.visitorPhone}>{visitor.phone}</Text>
                    <Text style={styles.visitorPurpose}>{visitor.purpose}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(visitor.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusIcon(visitor.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.visitorDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👤</Text>
                    <Text style={styles.detailText}>Host: {visitor.hostName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>{visitor.expectedDate} at {visitor.expectedTime}</Text>
                  </View>
                  {visitor.vehicleNumber && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>🚗</Text>
                      <Text style={styles.detailText}>{visitor.vehicleNumber}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.viewDetails}>View Details →</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No Visitors Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add a new visitor to get started'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Visitor FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/visitors/add' as any)}
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
  scrollView: {
    flex: 1,
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
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.lg,
  },
  visitorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  visitorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  visitorAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  visitorPhone: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  visitorPurpose: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 18,
  },
  visitorDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  viewDetails: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'right',
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
