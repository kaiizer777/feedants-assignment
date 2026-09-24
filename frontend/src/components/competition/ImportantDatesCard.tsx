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
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#00897B"
              style={styles.cellIcon}
            />
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Register Before</Text>
              <Text style={styles.dateValue}>{formatDateDisplay(registerBy)}</Text>
              <Text style={styles.timeValue}>{formatTimeDisplay(registerBy)}</Text>
            </View>
          </View>

          {/* Top Right: Submission Starts */}
          <View style={styles.gridCell}>
            <Ionicons
              name="paper-plane-outline"
              size={22}
              color="#00897B"
              style={styles.cellIcon}
            />
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
            <Feather
              name="upload"
              size={20}
              color="#00897B"
              style={styles.cellIcon}
            />
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
            <Ionicons
              name="trophy-outline"
              size={22}
              color="#00897B"
              style={styles.cellIcon}
            />
            <View style={styles.cellContent}>
              <Text style={styles.dateLabel}>Result Date</Text>
              <Text style={styles.dateValue}>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
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
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 10,
  },
  cellRightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#F1F5F9",
  },
  cellIcon: {
    marginTop: 2,
  },
  cellContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#007A78",
    marginBottom: 1,
    letterSpacing: -0.2,
  },
  timeValue: {
    fontSize: 12.5,
    color: "#0F172A",
    fontWeight: "700",
  },
});
