import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  phone?: string;
  photo?: string;
}

// Sample data for development
const SAMPLE_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Priya Shah',
    relationship: 'Spouse',
    age: 32,
    phone: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'Aarav Shah',
    relationship: 'Son',
    age: 8,
  },
  {
    id: '3',
    name: 'Ananya Shah',
    relationship: 'Daughter',
    age: 5,
  },
];

export default function FamilyMembersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>(SAMPLE_MEMBERS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      // TODO: Load from Firebase
      // For now, use sample data
      await new Promise(resolve => setTimeout(resolve, 500));
      setMembers(SAMPLE_MEMBERS);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  const handleDelete = (memberId: string, memberName: string) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to remove ${memberName} from your family members?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Delete from Firebase
              setMembers(members.filter(m => m.id !== memberId));
              Alert.alert('Success', 'Family member removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete family member');
            }
          },
        },
      ]
    );
  };

  const getRelationshipIcon = (relationship: string) => {
    const icons: { [key: string]: string } = {
      'Spouse': '💑',
      'Son': '👦',
      'Daughter': '👧',
      'Father': '👨',
      'Mother': '👩',
      'Brother': '👦',
      'Sister': '👧',
      'Grandfather': '👴',
      'Grandmother': '👵',
    };
    return icons[relationship] || '👤';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Members</Text>
        <TouchableOpacity onPress={() => router.push('/profile/add-member' as any)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>ℹ️</Text>
          <Text style={styles.infoBannerText}>
            Add your family members to help security identify them during their visits
          </Text>
        </View>

        {/* Members Grid */}
        <View style={styles.membersGrid}>
          {members.length > 0 ? (
            members.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => router.push(`/profile/edit-member/${member.id}` as any)}
                activeOpacity={0.7}
              >
                {/* Profile Icon */}
                <View style={styles.profileIcon}>
                  <Text style={styles.relationshipIcon}>
                    {getRelationshipIcon(member.relationship)}
                  </Text>
                </View>

                {/* Member Info */}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {member.name}
                  </Text>
                  <Text style={styles.memberRelation}>{member.relationship}</Text>
                  <Text style={styles.memberAge}>Age: {member.age}</Text>
                  {member.phone && (
                    <Text style={styles.memberPhone} numberOfLines={1}>
                      📞 {member.phone}
                    </Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/edit-member/${member.id}` as any);
                    }}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(member.id, member.name);
                    }}
                  >
                    <Text style={styles.actionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.emptyTitle}>No Family Members</Text>
              <Text style={styles.emptyText}>
                Add your family members to keep track of everyone in your household
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Household Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{members.length + 1}</Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{members.filter(m => m.age < 18).length}</Text>
              <Text style={styles.statLabel}>Children</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{members.filter(m => m.age >= 18).length + 1}</Text>
              <Text style={styles.statLabel}>Adults</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Member FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/profile/add-member' as any)}
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
  content: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    margin: Spacing.lg,
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
  membersGrid: {
    padding: Spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  relationshipIcon: {
    fontSize: 32,
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  memberRelation: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberAge: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  actionButtons: {
    justifyContent: 'center',
    gap: Spacing.xs,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  statsCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
