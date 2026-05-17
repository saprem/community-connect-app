import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Community Feed</Text>
      <Text style={styles.subtitle}>Coming Soon! Chat, events, and classifieds</Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>💬</Text>
        <Text style={styles.placeholderText}>Community features will appear here</Text>
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
