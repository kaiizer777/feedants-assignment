import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TrustInfoSectionProps {
  onHowItWorksPress?: () => void;
  onRefundPolicyPress?: () => void;
}

export const TrustInfoSection: React.FC<TrustInfoSectionProps> = ({
  onHowItWorksPress,
  onRefundPolicyPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Card: How will you receive prize money */}
      <TouchableOpacity
        style={styles.leftCard}
        onPress={onHowItWorksPress}
        activeOpacity={0.8}
      >
        <View style={styles.playIconBox}>
          <Ionicons name="play" size={16} color="#007A78" style={{ marginLeft: 2 }} />
        </View>
        <View style={styles.leftTextContent}>
          <Text style={styles.leftTitle}>How will you receive prize money?</Text>
          <Text style={styles.leftSubtitle}>Watch video to know more</Text>
        </View>
      </TouchableOpacity>

      {/* Right Card: Refund policy & Razorpay */}
      <View style={styles.rightCard}>
        <TouchableOpacity
          style={styles.policyRow}
          onPress={onRefundPolicyPress}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color="#00897B" />
          <Text style={styles.policyText}>Refund policy</Text>
        </TouchableOpacity>

        <View style={styles.razorpayRow}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#00897B" />
          <View style={styles.razorpayContent}>
            <Text style={styles.razorpayLabel}>Secure payments powered by</Text>
            <View style={styles.razorpayLogo}>
              <Ionicons name="flash" size={12} color="#0C2340" />
              <Text style={styles.razorpayText}>Razorpay</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  leftCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: "space-between",
  },
  playIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#99F6E4",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  leftTextContent: {
    gap: 3,
  },
  leftTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  leftSubtitle: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "500",
  },
  rightCard: {
    flex: 1.1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: "space-between",
    gap: 10,
  },
  policyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  policyText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  razorpayRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  razorpayContent: {
    flex: 1,
    gap: 3,
  },
  razorpayLabel: {
    fontSize: 10.5,
    color: "#64748B",
    lineHeight: 14,
    fontWeight: "500",
  },
  razorpayLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  razorpayText: {
    fontSize: 14,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#0C2340",
    letterSpacing: -0.3,
  },
});
