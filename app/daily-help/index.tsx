import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { getHelpers } from '../../services/firestoreHelpers';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface Helper {
  id: string;
  name: string;
  category: string;
  phone: string;
  rating: number;
  jobsCompleted: number;
  available: boolean;
  experience?: string;
  salary?: string;
  image?: string;
}

const SAMPLE_HELPERS: Helper[] = [
  {
    id: '1',
    name: 'Seema Tiwari',
    category: 'Cook',
    phone: '+91 98765 43210',
    rating: 4.8,
    jobsCompleted: 45,
    available: true,
    experience: '5',
    salary: '12000'
  },
  {
    id: '2',
    name: 'Rathod Piple Bai',
    category: 'Maid',
    phone: '+91 98765 43211',
    rating: 4.5,
    jobsCompleted: 32,
    available: true,
    experience: '3',
    salary: '10000'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    category: 'Driver',
    phone: '+91 98765 43212',
    rating: 4.9,
    jobsCompleted: 78,
    available: true,
    experience: '8',
    salary: '15000'
  },
  {
    id: '4',
    name: 'Amit Sharma',
    category: 'Plumber',
    phone: '+91 98765 43213',
    rating: 4.7,
    jobsCompleted: 56,
    available: false,
    experience: '6',
    salary: '18000'
  },
];

export default function DailyHelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [helpers, setHelpers] = useState<Helper[]>(SAMPLE_HELPERS); // Initialize with sample data
  const [loading, setLoading] = useState(false); // Start with false since we have sample data
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadHelpers();
  }, []);

  const loadHelpers = async () => {
    setLoading(false); // Set loading to false immediately so UI renders
    setRefreshing(false);

    try {
      if (user?.communityId) {
        console.log('User has communityId, attempting to load from Firebase...');
        const data = await getHelpers(user.communityId);
        if (data && data.length > 0) {
          console.log(`✅ Loaded ${data.length} helpers from Firebase`);
          setHelpers(data as Helper[]);
        } else {
          console.log('⚠️ No Firebase data, keeping sample helpers');
          // Keep SAMPLE_HELPERS (already set in state initialization)
        }
      } else {
        console.log('ℹ️ No user/communityId, using sample helpers');
        // Keep SAMPLE_HELPERS (already set in state initialization)
      }
    } catch (error) {
      console.error('❌ Error loading helpers:', error);
      console.log('Using sample helpers as fallback');
      // Keep SAMPLE_HELPERS (already set in state initialization)
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHelpers();
  };

  const filteredHelpers = searchQuery
    ? helpers.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.phone.includes(searchQuery) ||
        h.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpers;

  // Debug logging - moved to useEffect to avoid render issues
  useEffect(() => {
    console.log(`📊 Helpers State: Total=${helpers.length}, Filtered=${filteredHelpers.length}, Search="${searchQuery}"`);
    console.log('📋 Helpers Array:', JSON.stringify(helpers.map(h => ({ id: h.id, name: h.name }))));
  }, [helpers, filteredHelpers.length, searchQuery]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Cook': '👨‍🍳',
      'Maid': '🧹',
      'Driver': '🚗',
      'Plumber': '🔧',
      'Electrician': '💡',
      'Gardener': '🌱',
      'Security': '🔒',
      'Carpenter': '🔨',
    };
    return icons[category] || '👤';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Cook': '#FF6B6B',
      'Maid': '#4ECDC4',
      'Driver': '#45B7D1',
      'Plumber': '#FFA07A',
      'Electrician': '#FFD93D',
      'Gardener': '#6BCF7F',
      'Security': '#95A5A6',
      'Carpenter': '#D4A574',
    };
    return colors[category] || Colors.primary;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading helpers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Daily Help</Text>
        <TouchableOpacity onPress={() => router.push('/daily-help/add' as any)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone, or type"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>ℹ️</Text>
          <Text style={styles.infoBannerText}>
            Tap on any helper to view details, call, or manage
          </Text>
        </View>

        {/* Helpers Grid */}
        <View style={styles.helpersGrid}>
          {filteredHelpers.length > 0 ? (
            filteredHelpers.map((helper) => (
              <TouchableOpacity
                key={helper.id}
                style={styles.helperCard}
                onPress={() => router.push(`/daily-help/${helper.id}` as any)}
                activeOpacity={0.7}
              >
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                  <View style={[styles.profileImage, { backgroundColor: getCategoryColor(helper.category) + '20' }]}>
                    <Text style={styles.profileInitial}>
                      {helper.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  {/* Category Badge */}
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(helper.category) }]}>
                    <Text style={styles.categoryBadgeText}>{getCategoryIcon(helper.category)}</Text>
                  </View>
                  {/* Availability Indicator */}
                  {!helper.available && (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableText}>Not Available</Text>
                    </View>
                  )}
                </View>

                {/* Helper Info */}
                <View style={styles.helperInfo}>
                  <Text style={styles.helperName} numberOfLines={1}>
                    {helper.name}
                  </Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{helper.category}</Text>
                  </View>

                  {/* Rating & Jobs */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>⭐</Text>
                      <Text style={styles.statText}>{helper.rating.toFixed(1)}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>🏠</Text>
                      <Text style={styles.statText}>{helper.jobsCompleted}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(`tel:${helper.phone}`);
                      }}
                    >
                      <Text style={styles.actionIcon}>📞</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        const phoneNumber = helper.phone.replace(/\D/g, '');
                        Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                      }}
                    >
                      <Text style={styles.actionIcon}>💬</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/daily-help/${helper.id}` as any);
                      }}
                    >
                      <Text style={styles.actionIcon}>👁️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No Helpers Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add your first helper to get started'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Helper FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/daily-help/add' as any)}
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
  },
  loadingText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
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
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  infoBannerIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  helpersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    paddingBottom: 80,
  },
  helperCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    margin: '1.5%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 5,
    right: '28%',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  categoryBadgeText: {
    fontSize: 16,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.danger,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  unavailableText: {
    fontSize: 9,
    color: Colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
  helperInfo: {
    alignItems: 'center',
  },
  helperName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  categoryTag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  categoryTagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    width: '100%',
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
