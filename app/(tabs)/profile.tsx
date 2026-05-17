import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.role}>Owner • Block A, Flat 101</Text>
      </View>

      <View style={styles.section}>
        <MenuItem icon="👤" title="Personal Information" />
        <MenuItem icon="🏠" title="Residence Details" />
        <MenuItem icon="👨‍👩‍👧" title="Family Members" />
        <MenuItem icon="🚗" title="Vehicles" />
        <MenuItem icon="🔔" title="Notifications" />
        <MenuItem icon="⚙️" title="Settings" />
        <MenuItem icon="❓" title="Help & Support" />
        <MenuItem icon="🚪" title="Logout" isDestructive />
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, isDestructive }: {
  icon: string;
  title: string;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={[styles.menuTitle, isDestructive && styles.destructive]}>{title}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  role: {
    fontSize: FontSizes.md,
    color: Colors.surface,
    opacity: 0.9,
  },
  section: {
    padding: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  destructive: {
    color: Colors.danger,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textLight,
  },
});
