import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Competition } from "../../types/competition";
import { formatDateDisplay } from "../../utils/formatters";

interface BottomActionBarProps {
  competition: Competition;
  isLoading: boolean;
  onRegisterPress: () => void;
  onSubmitPress: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  competition,
  isLoading,
  onRegisterPress,
  onSubmitPress,
}) => {
  const {
    spotsRemaining,
    isRegistrationOpen,
    isSubmissionOpen,
    submissionStart,
    submissionEnd,
    userRegistration,
    registerBy,
  } = competition;

  const userStatus = userRegistration?.status || "not_registered";
  const isRegistered = Boolean(userRegistration?.isRegistered);
  const hasSubmitted = userStatus === "submitted" || Boolean(userRegistration?.hasSubmitted);

  // Check if registration deadline has passed client-side as well
  const now = new Date();
  const regDeadlinePassed = !isRegistrationOpen || now >= new Date(registerBy);
  const subWindowClosed = !isSubmissionOpen && now >= new Date(submissionEnd);
  const subWindowUpcoming = !isSubmissionOpen && now < new Date(submissionStart);

  // Derive button configuration based on exact state matrix matching Objective_Page.png
  let label = "Register Now";
  let subLabel = `Only ${spotsRemaining} spots left • ₹${competition.entryFee}`;
  let isEnabled = true;
  let onPress = onRegisterPress;
  let buttonStyle: any = styles.buttonPrimary;
  let statusIcon: keyof typeof Ionicons.glyphMap | null = null;

  if (!isRegistered) {
    if (spotsRemaining <= 0) {
      label = "Registration Full";
      subLabel = "All 20 spots have been booked";
      isEnabled = false;
      buttonStyle = styles.buttonDisabled;
      statusIcon = "close-circle-outline";
    } else if (regDeadlinePassed) {
      label = "Registration Closed";
      subLabel = `Deadline passed on ${formatDateDisplay(registerBy)}`;
      isEnabled = false;
      buttonStyle = styles.buttonDisabled;
      statusIcon = "time-outline";
    } else {
      label = "Register Now";
      subLabel = `Only ${spotsRemaining} spots left • ₹${competition.entryFee}`;
      isEnabled = true;
      onPress = onRegisterPress;
      buttonStyle = styles.buttonPrimary;
    }
  } else {
    // User is registered
    if (hasSubmitted) {
      label = "Submitted";
      subLabel = "Entry received & under evaluation";
      isEnabled = false;
      buttonStyle = styles.buttonSubmitted;
      statusIcon = "checkmark-circle";
    } else if (subWindowClosed) {
      label = "Submission Window Closed";
      subLabel = `Closed on ${formatDateDisplay(submissionEnd)}`;
      isEnabled = false;
      buttonStyle = styles.buttonDisabled;
      statusIcon = "alert-circle-outline";
    } else if (subWindowUpcoming) {
      label = `Submissions open on ${formatDateDisplay(submissionStart)}`;
      subLabel = "Registered • Get your performance ready";
      isEnabled = false;
      buttonStyle = styles.buttonDisabled;
      statusIcon = "calendar-outline";
    } else {
      // Registered + submission open + not yet submitted
      label = "Upload Submission";
      subLabel = "Registered";
      isEnabled = true;
      onPress = onSubmitPress;
      buttonStyle = styles.buttonPrimary;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, buttonStyle, !isEnabled && styles.buttonInactiveOpacity]}
        disabled={!isEnabled || isLoading}
        onPress={onPress}
        activeOpacity={0.88}
      >
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.buttonText}>Processing...</Text>
          </View>
        ) : (
          <View style={styles.contentColumn}>
            <View style={styles.labelRow}>
              {statusIcon && (
                <Ionicons
                  name={statusIcon}
                  size={16}
                  color={buttonStyle === styles.buttonSubmitted ? "#00897B" : "#FFFFFF"}
                />
              )}
              <Text
                style={[
                  styles.buttonText,
                  buttonStyle === styles.buttonSubmitted && styles.submittedText,
                ]}
              >
                {label}
              </Text>
            </View>

            {subLabel && (
              <Text
                style={[
                  styles.subText,
                  buttonStyle === styles.buttonSubmitted && styles.submittedSubText,
                ]}
              >
                {subLabel}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1.5,
    borderBottomWidth: 2.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: "#005C54",
    borderTopColor: "rgba(255, 255, 255, 0.32)",
    borderLeftColor: "#004842",
    borderRightColor: "#004842",
    borderBottomColor: "#002B27",
    shadowColor: "#002B27",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonSubmitted: {
    backgroundColor: "#E6F7F5",
    borderTopWidth: 1.5,
    borderTopColor: "#A7F3D0",
    borderLeftColor: "#5EEAD4",
    borderRightColor: "#5EEAD4",
    borderBottomColor: "#0D9488",
    shadowColor: "#00897B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#64748B",
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    borderLeftColor: "#475569",
    borderRightColor: "#475569",
    borderBottomColor: "#334155",
  },
  buttonInactiveOpacity: {
    opacity: 0.9,
  },
  contentColumn: {
    alignItems: "center",
    gap: 1.5,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 11.5,
    fontWeight: "600",
  },
  submittedText: {
    color: "#007A78",
  },
  submittedSubText: {
    color: "#0F766E",
    fontWeight: "600",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
});
