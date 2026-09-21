import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { API_CONFIG } from "@/api/config";
import { Spacing } from "@/constants/theme";

export default function HomeScreen() {
  const { data, loading, error, refetch } = useHealthCheck();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="small" style={styles.badge}>
            FEEDANTS ASSIGNMENT
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Hello World 👋
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Frontend initialized & ready for feature development.
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">API Configuration</ThemedText>
          <ThemedText type="code" style={styles.codeText}>
            {API_CONFIG.BASE_URL}
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText type="smallBold">Backend Status</ThemedText>
          {loading ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color="#3c87f7" />
              <ThemedText type="small">Checking backend health...</ThemedText>
            </View>
          ) : error ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.dotError]} />
                <ThemedText type="small" style={styles.errorText}>
                  Backend offline or unreachable
                </ThemedText>
              </View>
              <ThemedText type="code" style={styles.detailText}>
                {error}
              </ThemedText>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={refetch}
                activeOpacity={0.8}
              >
                <ThemedText type="smallBold" style={styles.retryButtonText}>
                  Retry Connection
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.dotSuccess]} />
                <ThemedText type="small" style={styles.successText}>
                  Connected: status {data?.status} (DB: {data?.database})
                </ThemedText>
              </View>
              <ThemedText type="code" style={styles.detailText}>
                Last checked: {data?.timestamp}
              </ThemedText>
            </View>
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
  },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    justifyContent: "center",
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
    alignItems: "flex-start",
  },
  badge: {
    letterSpacing: 1.2,
    opacity: 0.7,
    fontWeight: "700",
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: Spacing.two,
  },
  codeText: {
    fontSize: 13,
    opacity: 0.85,
  },
  statusContainer: {
    gap: Spacing.two,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotSuccess: {
    backgroundColor: "#22c55e",
  },
  dotError: {
    backgroundColor: "#ef4444",
  },
  successText: {
    color: "#22c55e",
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  detailText: {
    fontSize: 11,
    opacity: 0.65,
  },
  retryButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#ffffff",
  },
});
