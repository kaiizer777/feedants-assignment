import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { formatDateDisplay, formatTimeDisplay } from "../../utils/formatters";

interface ImportantDatesCardProps {
  registerBy: string | Date | undefined;
  submissionStart: string | Date | undefined;
  submissionEnd: string | Date | undefined;
  resultDate: string | Date | undefined;
}

export const ImportantDatesCard: React.FC<ImportantDatesCardProps> = ({
  registerBy,
  submissionStart,
  submissionEnd,
  resultDate,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important Dates</Text>

      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Top Left: Register Before */}
          <View style={[styles.gridCell, styles.cellRightBorder]}>
            <View style={styles.iconSquircle}>
              <Ionicons name="calendar" size={17} color="#007A78" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Register Before</Text>
              <Text style={styles.dateValue}>{formatDateDisplay(registerBy)}</Text>
              <Text style={styles.timeValue}>{formatTimeDisplay(registerBy)}</Text>
            </View>
          </View>

          {/* Top Right: Submission Starts */}
          <View style={styles.gridCell}>
            <View style={styles.iconSquircle}>
              <Ionicons name="paper-plane" size={16} color="#007A78" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Submission Starts</Text>
              <Text style={styles.dateValue}>
                {formatDateDisplay(submissionStart)}
              </Text>
              <Text style={styles.timeValue}>
                {formatTimeDisplay(submissionStart)}
              </Text>
            </View>
          </View>
        </View>

        {/* Row Divider */}
        <View style={styles.rowDivider} />

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Bottom Left: Submission Ends */}
          <View style={[styles.gridCell, styles.cellRightBorder]}>
            <View style={styles.iconSquircle}>
              <Feather name="upload-cloud" size={17} color="#007A78" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Submission Ends</Text>
              <Text style={styles.dateValue}>
                {formatDateDisplay(submissionEnd)}
              </Text>
              <Text style={styles.timeValue}>
                {formatTimeDisplay(submissionEnd)}
              </Text>
            </View>
          </View>

          {/* Bottom Right: Result Date */}
          <View style={styles.gridCell}>
            <View style={[styles.iconSquircle, styles.trophySquircle]}>
              <Ionicons name="trophy" size={16} color="#D97706" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Result Date</Text>
              <Text style={[styles.dateValue, styles.resultDateValue]}>
                {formatDateDisplay(resultDate)}
              </Text>
              <Text style={styles.timeValue}>
                {formatTimeDisplay(resultDate)}
              </Text>
            </View>
          </View>
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  grid: {
    overflow: "hidden",
  },
  gridRow: {
    flexDirection: "row",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  gridCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 10,
  },
  cellRightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#F1F5F9",
  },
  iconSquircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  trophySquircle: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },
  cellContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  dateValue: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#007A78",
    marginBottom: 1,
    letterSpacing: -0.2,
  },
  resultDateValue: {
    color: "#B45309",
  },
  timeValue: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
