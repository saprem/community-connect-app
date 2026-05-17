import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { getPayments } from '../../services/firestoreHelpers';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  category: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  communityId: string;
  createdAt?: string;
}

const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: '1',
    userId: 'user123',
    userName: 'John Doe',
    amount: 5000,
    category: 'Maintenance',
    description: 'Monthly maintenance charges',
    dueDate: '2024-06-30',
    status: 'pending',
    communityId: 'default',
  },
  {
    id: '2',
    userId: 'user123',
    userName: 'John Doe',
    amount: 1500,
    category: 'Security',
    description: 'Security charges Q2',
    dueDate: '2024-06-15',
    status: 'overdue',
    communityId: 'default',
  },
  {
    id: '3',
    userId: 'user123',
    userName: 'John Doe',
    amount: 3000,
    category: 'Utilities',
    description: 'Water and electricity charges',
    dueDate: '2024-05-31',
    status: 'paid',
    paymentMethod: 'UPI',
    transactionId: 'UPI123456789',
    paidAt: '2024-05-28T10:30:00Z',
    communityId: 'default',
  },
];

export default function PaymentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      if (user?.id) {
        const data = await getPayments(user.id);
        setPayments(data as Payment[]);
      } else {
        // Mock data for development
        setPayments(SAMPLE_PAYMENTS);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      setPayments(SAMPLE_PAYMENTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const handlePayViaUPI = (payment: Payment) => {
    // UPI payment integration
    // TODO: Replace with your actual community UPI ID
    const upiId = 'yourupiid@paytm'; // e.g., 'greenvalley@paytm' or '9876543210@paytm'
    const payeeName = 'Community Connect';
    const amount = payment.amount;
    const transactionNote = `${payment.category}-${payment.id.substring(0, 8)}`;

    // UPI deep link format as per NPCI specification
    // Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=<CURRENCY>
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;

    Alert.alert(
      'Pay via UPI',
      `Amount: ₹${amount.toLocaleString('en-IN')}\nFor: ${payment.description}\n\nYou will be redirected to your UPI app to complete the payment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open UPI App',
          onPress: async () => {
            try {
              const canOpen = await Linking.canOpenURL(upiUrl);
              if (canOpen) {
                await Linking.openURL(upiUrl);
                // Note: We can't automatically verify payment completion
                // User needs to manually update or you need a payment gateway webhook
                setTimeout(() => {
                  Alert.alert(
                    'Payment Initiated',
                    'After completing payment in your UPI app, please return here.\n\nNote: It may take a few minutes for the payment to reflect.',
                    [{ text: 'OK' }]
                  );
                }, 1000);
              } else {
                throw new Error('Cannot open UPI app');
              }
            } catch (error) {
              Alert.alert(
                'UPI App Not Found',
                'Please install a UPI app like:\n• Google Pay\n• PhonePe\n• Paytm\n• BHIM\n\nOr contact management for alternative payment methods.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amount.toString().includes(searchQuery);

    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return Colors.success;
      case 'overdue': return Colors.danger;
      default: return Colors.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'overdue': return '⚠️';
      default: return '⏳';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue' || isOverdue(p.dueDate, p.status));
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.warning + '20' }]}>
            <Text style={styles.statNumber}>₹{totalPending.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.danger + '20' }]}>
            <Text style={styles.statNumber}>₹{totalOverdue.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        {/* Quick Pay Banner */}
        {(totalPending > 0 || totalOverdue > 0) && (
          <View style={styles.quickPayBanner}>
            <View style={styles.quickPayContent}>
              <Text style={styles.quickPayTitle}>💳 Quick Pay</Text>
              <Text style={styles.quickPayAmount}>
                Total Due: ₹{(totalPending + totalOverdue).toLocaleString('en-IN')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.quickPayButton}
              onPress={() => {
                if (pendingPayments.length > 0) {
                  handlePayViaUPI(pendingPayments[0]);
                }
              }}
            >
              <Text style={styles.quickPayButtonText}>Pay via UPI</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by category, description, or amount"
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
              All ({payments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'pending' && styles.filterChipActive]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text style={[styles.filterText, filterStatus === 'pending' && styles.filterTextActive]}>
              ⏳ Pending ({pendingPayments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'overdue' && styles.filterChipActive]}
            onPress={() => setFilterStatus('overdue')}
          >
            <Text style={[styles.filterText, filterStatus === 'overdue' && styles.filterTextActive]}>
              ⚠️ Overdue ({overduePayments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'paid' && styles.filterChipActive]}
            onPress={() => setFilterStatus('paid')}
          >
            <Text style={[styles.filterText, filterStatus === 'paid' && styles.filterTextActive]}>
              ✅ Paid
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Payments List */}
        <View style={styles.listContainer}>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={styles.paymentCard}
                onPress={() => router.push(`/payments/${payment.id}` as any)}
              >
                <View style={styles.paymentHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryIcon}>
                      {payment.category === 'Maintenance' ? '🏠' :
                       payment.category === 'Security' ? '🔒' :
                       payment.category === 'Utilities' ? '💡' : '💰'}
                    </Text>
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentCategory}>{payment.category}</Text>
                    <Text style={styles.paymentDescription}>{payment.description}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusIcon(payment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.paymentDetails}>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Amount:</Text>
                    <Text style={styles.amountValue}>₹{payment.amount.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>
                      Due: {formatDate(payment.dueDate)}
                      {isOverdue(payment.dueDate, payment.status) && payment.status !== 'paid' && (
                        <Text style={styles.overdueText}> (Overdue)</Text>
                      )}
                    </Text>
                  </View>
                  {payment.paidAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>✅</Text>
                      <Text style={styles.detailText}>
                        Paid on {formatDate(payment.paidAt)}
                      </Text>
                    </View>
                  )}
                </View>

                {payment.status !== 'paid' && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handlePayViaUPI(payment);
                    }}
                  >
                    <Text style={styles.payButtonText}>Pay via UPI →</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyTitle}>No Payments Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No payment records available'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Payment FAB (for admin/management) */}
      {(user?.role === 'admin' || user?.role === 'management') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/payments/add' as any)}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
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
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  quickPayBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  quickPayContent: {
    marginBottom: Spacing.md,
  },
  quickPayTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  quickPayAmount: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  quickPayButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickPayButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
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
  paymentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCategory: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
  paymentDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  amountLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  detailRow: {
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
  overdueText: {
    color: Colors.danger,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  payButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
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
