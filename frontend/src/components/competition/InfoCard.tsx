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

  return (
    <View style={styles.card}>
      {/* Title & Registered Badge Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#00897B" />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {tags
          ?.filter((t) => !t.toLowerCase().includes("certificate"))
          .map((tag, idx) => (
            <View key={`${tag}-${idx}`} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}

        {certificateProvided && (
          <View style={styles.certRow}>
            <Ionicons name="trophy-outline" size={14} color="#00897B" />
            <Text style={styles.certText}>Winners get certificate</Text>
          </View>
        )}
      </View>

      {/* Metrics Row: Prize Pool, Entry Fee, Spots Progress */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>{formatCurrency(prizePool)}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>{formatCurrency(entryFee)}</Text>
        </View>

        {/* Spots Left & Progress Bar */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Ionicons name="people-outline" size={13} color="#007A78" />
            <Text style={styles.spotsLeftText} numberOfLines={1}>
              {spotsRemaining === 0
                ? "Spots Full"
                : `Only ${spotsRemaining} spots left`}
            </Text>
          </View>

          {/* Progress track */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: progressPercent }]} />
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
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
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
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  registeredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E6F7F5",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
  },
  registeredText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#007A78",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: "#F1F5F9",
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
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 2,
  },
  certText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007A78",
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  metricColumn: {
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  prizeValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#007A78",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  feeValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  spotsColumn: {
    alignItems: "flex-end",
    minWidth: 125,
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
  progressBarTrack: {
    width: 125,
    height: 4.5,
    backgroundColor: "#E0F2F1",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 3,
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
