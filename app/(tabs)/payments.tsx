import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function PaymentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payments</Text>
      <Text style={styles.subtitle}>Maintenance & utility payments</Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>💰</Text>
        <Text style={styles.placeholderText}>Payment features coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  placeholder: {
    backgroundColor: Colors.surface,
    padding: Spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
