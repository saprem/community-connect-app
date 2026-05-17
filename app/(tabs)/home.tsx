import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.communityName}>Green Valley Apartments</Text>
        <Text style={styles.flatInfo}>Block A, Flat 101</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionCard, { borderColor: Colors.primary }]}
            onPress={() => router.push('/visitors/add' as any)}
          >
            <Text style={styles.quickActionIcon}>🚶</Text>
            <Text style={styles.quickActionTitle}>Add Visitor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionCard, { borderColor: Colors.success }]}
            onPress={() => router.push('/(tabs)/payments' as any)}
          >
            <Text style={styles.quickActionIcon}>💳</Text>
            <Text style={styles.quickActionTitle}>Pay Dues</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionCard, { borderColor: Colors.warning }]}
            onPress={() => router.push('/daily-help' as any)}
          >
            <Text style={styles.quickActionIcon}>🧹</Text>
            <Text style={styles.quickActionTitle}>Daily Help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionCard, { borderColor: Colors.info }]}
            onPress={() => router.push('/visitors' as any)}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionTitle}>My Visitors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionCard, { borderColor: Colors.danger }]}
            onPress={() => router.push('/security' as any)}
          >
            <Text style={styles.quickActionIcon}>🔒</Text>
            <Text style={styles.quickActionTitle}>Security</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending Approvals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>🚪</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Visitor Request</Text>
              <Text style={styles.cardSubtitle}>John Doe - Today 2:00 PM</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.approveButton}>
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ActivityItem
          icon="💬"
          title="New post in Community"
          time="2 hours ago"
        />
        <ActivityItem
          icon="💰"
          title="Maintenance payment received"
          time="Yesterday"
        />
        <ActivityItem
          icon="📢"
          title="New notice posted"
          time="2 days ago"
        />
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventCard}>
          <View style={styles.eventDate}>
            <Text style={styles.eventDay}>25</Text>
            <Text style={styles.eventMonth}>May</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Community Meeting</Text>
            <Text style={styles.eventTime}>6:00 PM - Clubhouse</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const ActivityItem = ({ icon, title, time }: { icon: string; title: string; time: string }) => (
  <View style={styles.activityItem}>
    <Text style={styles.activityIcon}>{icon}</Text>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  welcomeBanner: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  welcomeText: {
    fontSize: FontSizes.lg,
    color: Colors.surface,
    opacity: 0.9,
  },
  communityName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
    marginTop: Spacing.xs,
  },
  flatInfo: {
    fontSize: FontSizes.md,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  approveButton: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: Colors.surface,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rejectButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventDate: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  eventDay: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  eventMonth: {
    fontSize: FontSizes.sm,
    color: Colors.surface,
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  eventTime: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
