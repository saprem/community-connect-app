import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function VisitorsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Visitors</Text>

        <VisitorCard
          name="John Doe"
          purpose="Personal Visit"
          time="Today, 2:00 PM"
          status="approved"
        />
        <VisitorCard
          name="Jane Smith"
          purpose="Delivery"
          time="Today, 10:30 AM"
          status="checked-out"
        />
        <VisitorCard
          name="Mike Johnson"
          purpose="Maintenance"
          time="Yesterday, 4:00 PM"
          status="checked-out"
        />
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const VisitorCard = ({ name, purpose, time, status }: {
  name: string;
  purpose: string;
  time: string;
  status: string;
}) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Text style={styles.icon}>👤</Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.visitorName}>{name}</Text>
      <Text style={styles.purpose}>{purpose}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: status === 'approved' ? Colors.success : Colors.textLight }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  visitorName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  purpose: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  time: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FontSizes.xs,
    color: Colors.surface,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  fabText: {
    fontSize: 32,
    color: Colors.surface,
    fontWeight: 'bold',
  },
});
