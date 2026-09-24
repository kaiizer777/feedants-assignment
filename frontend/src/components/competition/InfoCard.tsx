import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Competition } from "../../types/competition";
import { formatCurrency } from "../../utils/formatters";

interface InfoCardProps {
  competition: Competition;
}

export const InfoCard: React.FC<InfoCardProps> = ({ competition }) => {
  const {
    title,
    tags,
    prizePool,
    entryFee,
    totalSpots,
    spotsTaken,
    spotsRemaining,
    userRegistration,
    certificateProvided,
  } = competition;

  const isRegistered = Boolean(userRegistration?.isRegistered);
  const progressRatio = totalSpots > 0 ? Math.min(1, Math.max(0, spotsTaken / totalSpots)) : 0;
  const progressPercent = `${Math.round(progressRatio * 100)}%` as any;
  const isSpotsLow = spotsRemaining <= 5 && spotsRemaining > 0;

  return (
    <View style={styles.card}>
      {/* Title & Registered Badge Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={15} color="#007A78" />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>

      {/* Tags & Certificate Row */}
      <View style={styles.tagsRow}>
        {tags
          ?.filter((t) => !t.toLowerCase().includes("certificate"))
          .map((tag, idx) => (
            <View key={`${tag}-${idx}`} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}

        {certificateProvided && (
          <View style={styles.certChip}>
            <Ionicons name="trophy" size={13} color="#D97706" />
            <Text style={styles.certText}>Winners get certificate</Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.metricDivider} />

      {/* Metrics Row: Prize Pool, Entry Fee, Spots Progress */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>{formatCurrency(prizePool)}</Text>
          <Text style={styles.metricSubtext}>Guaranteed</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.verticalDivider} />

        {/* Entry Fee */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>{formatCurrency(entryFee)}</Text>
          <Text style={styles.metricSubtext}>Single entry</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.verticalDivider} />

        {/* Spots Left & Progress Bar */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Ionicons
              name={isSpotsLow ? "flame" : "people"}
              size={13}
              color={isSpotsLow ? "#EA580C" : "#007A78"}
            />
            <Text
              style={[
                styles.spotsLeftText,
                isSpotsLow && styles.spotsLowText,
                spotsRemaining === 0 && styles.spotsFullText,
              ]}
              numberOfLines={1}
            >
              {spotsRemaining === 0
                ? "Spots Full"
                : `Only ${spotsRemaining} spots left`}
            </Text>
          </View>

          {/* Progress track */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: progressPercent },
                isSpotsLow && { backgroundColor: "#EA580C" },
              ]}
            />
          </View>

          <Text style={styles.bookedText}>
            {spotsTaken} / {totalSpots} Booked
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
    lineHeight: 27,
  },
  registeredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E6F7F5",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderTopColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007A78",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  certChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  certText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#B45309",
  },
  metricDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricColumn: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 8,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 1,
    letterSpacing: 0.1,
  },
  prizeValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#007A78",
    letterSpacing: -0.4,
    fontVariant: ["tabular-nums"],
  },
  feeValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
    fontVariant: ["tabular-nums"],
  },
  metricSubtext: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 1,
  },
  spotsColumn: {
    alignItems: "flex-end",
    minWidth: 120,
    flex: 1.2,
  },
  spotsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007A78",
  },
  spotsLowText: {
    color: "#EA580C",
  },
  spotsFullText: {
    color: "#DC2626",
  },
  progressBarTrack: {
    width: "100%",
    maxWidth: 125,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 2,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#00897B",
    borderRadius: 3,
  },
  bookedText: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
});
