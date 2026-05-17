import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.role}>
          {user?.role || 'Member'} • {user?.communityId || 'Community'}
        </Text>
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="👤"
          title="Personal Information"
          onPress={() => router.push('/profile/personal-info' as any)}
        />
        <MenuItem icon="🏠" title="Residence Details" onPress={() => {}} />
        <MenuItem
          icon="👨‍👩‍👧"
          title="Family Members"
          onPress={() => router.push('/profile/family-members' as any)}
        />
        <MenuItem icon="🚗" title="Vehicles" onPress={() => {}} />
        <MenuItem
          icon="🧹"
          title="Daily Help"
          onPress={() => router.push('/daily-help' as any)}
        />
        <MenuItem icon="🔔" title="Notifications" onPress={() => {}} />
        <MenuItem icon="⚙️" title="Settings" onPress={() => {}} />
        <MenuItem icon="❓" title="Help & Support" onPress={() => {}} />
        <MenuItem
          icon="🚪"
          title="Logout"
          isDestructive
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, isDestructive, onPress }: {
  icon: string;
  title: string;
  isDestructive?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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
