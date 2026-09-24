import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const LoadingSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#007A78" />
        <Text style={styles.loadingText}>Loading competition details...</Text>
      </View>

      {/* Placeholder Skeletons */}
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonJudgeCard} />
      <View style={styles.skeletonCountdown} />
      <View style={styles.skeletonGrid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 14,
    backgroundColor: "#F8F9FA",
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007A78",
  },
  skeletonCard: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    opacity: 0.6,
  },
  skeletonJudgeCard: {
    height: 80,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    opacity: 0.5,
  },
  skeletonCountdown: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
    opacity: 0.5,
  },
  skeletonGrid: {
    height: 180,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    opacity: 0.4,
  },
});
