import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface Helper {
  id: string;
  name: string;
  category: string;
  phone: string;
  rating: number;
  jobsCompleted: number;
  available: boolean;
}

const CATEGORIES = [
  { id: 'maids', name: 'Maids', icon: '🧹', count: 11 },
  { id: 'cooks', name: 'Cooks', icon: '👨‍🍳', count: 19 },
  { id: 'drivers', name: 'Drivers', icon: '🚗', count: 8 },
  { id: 'plumbers', name: 'Plumbers', icon: '🔧', count: 5 },
  { id: 'electricians', name: 'Electricians', icon: '💡', count: 6 },
  { id: 'gardeners', name: 'Gardeners', icon: '🌱', count: 4 },
];

const SAMPLE_HELPERS: Helper[] = [
  { id: '1', name: 'Bujji', category: 'Maids', phone: '+91 98765 43210', rating: 4.5, jobsCompleted: 1, available: true },
  { id: '2', name: 'Sunitha', category: 'Maids', phone: '+91 98765 43211', rating: 3.0, jobsCompleted: 2, available: true },
  { id: '3', name: 'Sridhar', category: 'Cooks', phone: '+91 98765 43212', rating: 5.0, jobsCompleted: 1, available: true },
  { id: '4', name: 'Prabhakar', category: 'Cooks', phone: '+91 98765 43213', rating: 5.0, jobsCompleted: 1, available: false },
];

export default function DailyHelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Help</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Mobile"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🏠 House Helps</Text>
        <Text style={styles.bannerSubtext}>Maids, cooks, drivers, and more</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Manage your{'\n'}Daily Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>✏️</Text>
          <Text style={styles.actionText}>Ask your{'\n'}community</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      {CATEGORIES.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => router.push(`/daily-help/${category.id}` as any)}
          >
            <View style={styles.categoryTitle}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} profiles</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Sample Helpers */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.helpersScroll}>
            {SAMPLE_HELPERS
              .filter((helper) => helper.category === category.name)
              .map((helper) => (
                <TouchableOpacity
                  key={helper.id}
                  style={styles.helperCard}
                  onPress={() => router.push(`/daily-help/profile/${helper.id}` as any)}
                >
                  {!helper.available && (
                    <View style={styles.availabilityBadge}>
                      <Text style={styles.availabilityText}>Open to work</Text>
                    </View>
                  )}
                  <View style={styles.helperAvatar}>
                    <Text style={styles.helperAvatarText}>
                      {helper.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <View style={styles.helperStats}>
                    <Text style={styles.helperStat}>
                      🏠 {helper.jobsCompleted}
                    </Text>
                    <Text style={styles.helperStat}>
                      ⭐ {helper.rating.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ))}

      {/* Add Helper Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/daily-help/add' as any)}
      >
        <Text style={styles.addButtonText}>+ Add Your Helper</Text>
      </TouchableOpacity>
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
  banner: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  bannerText: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  bannerSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.surface,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  categoryName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 32,
    color: Colors.textLight,
  },
  helpersScroll: {
    paddingLeft: Spacing.lg,
  },
  helperCard: {
    width: 120,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginRight: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: Colors.warning,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 1,
  },
  availabilityText: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  helperAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  helperAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  helperName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  helperStats: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  helperStat: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
});
