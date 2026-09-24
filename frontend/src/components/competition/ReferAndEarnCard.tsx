import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReferAndEarnCardProps {
  referralUrl?: string;
  onReferNow?: () => void;
}

export const ReferAndEarnCard: React.FC<ReferAndEarnCardProps> = ({
  referralUrl = "https://feedants.com/r/referral123",
  onReferNow,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconSquircle}>
            <Ionicons
              name="megaphone"
              size={18}
              color="#007A78"
              style={styles.megaphoneIcon}
            />
          </View>
          <View>
            <Text style={styles.title}>Refer & Earn</Text>
            <Text style={styles.subtitle}>Get discount on next contest</Text>
          </View>
        </View>

        <View style={styles.rewardPill}>
          <Text style={styles.rewardPillText}>
            Earn <Text style={styles.rewardPillBold}>₹10</Text> / signup
          </Text>
        </View>
      </View>

      {/* Bottom Action Row: Link Box with Copy + Refer CTA */}
      <View style={styles.actionRow}>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {referralUrl}
          </Text>

          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copyButtonActive]}
            onPress={handleCopy}
            activeOpacity={0.75}
          >
            {copied && <Ionicons name="checkmark" size={11} color="#007A78" style={{ marginRight: 2 }} />}
            <Text style={[styles.copyButtonText, copied && styles.copyButtonTextActive]}>
              {copied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.referButton}
          onPress={onReferNow}
          activeOpacity={0.85}
        >
          <Text style={styles.referButtonText}>Refer Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EEFBF8",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconSquircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  megaphoneIcon: {
    transform: [{ rotate: "-15deg" }],
  },
  title: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 10.5,
    color: "#0F766E",
    fontWeight: "500",
  },
  rewardPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  rewardPillText: {
    fontSize: 10.5,
    color: "#0F766E",
    fontWeight: "600",
  },
  rewardPillBold: {
    fontWeight: "800",
    color: "#005C54",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  linkBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 4,
    height: 36,
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    color: "#007A78",
    fontWeight: "600",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#E6F7F5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  copyButtonActive: {
    backgroundColor: "#CCFBF1",
    borderColor: "#5EEAD4",
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#007A78",
  },
  copyButtonTextActive: {
    color: "#005C54",
  },
  referButton: {
    backgroundColor: "#005C54",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.35)",
    borderBottomWidth: 1.5,
    borderBottomColor: "#002B27",
    shadowColor: "#002B27",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 2,
  },
  referButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
});
