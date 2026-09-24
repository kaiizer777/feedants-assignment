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
      <View style={styles.innerRow}>
        {/* Left: Prominent Megaphone Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons
            name="megaphone-outline"
            size={28}
            color="#00897B"
            style={styles.megaphoneIcon}
          />
        </View>

        {/* Center: Title + Referral Link with Copy Button */}
        <View style={styles.centerCol}>
          <Text style={styles.title} numberOfLines={1}>
            Refer & Earn more discount
          </Text>

          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>
              {referralUrl}
            </Text>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Text style={styles.copyButtonText}>
                {copied ? "Copied" : "Copy Link"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right: Refer Now Button + Earning Subtitle underneath */}
        <View style={styles.rightCol}>
          <TouchableOpacity
            style={styles.referButton}
            onPress={onReferNow}
            activeOpacity={0.8}
          >
            <Text style={styles.referButtonText}>Refer Now</Text>
          </TouchableOpacity>

          <Text style={styles.earningsText}>
            You earn <Text style={styles.boldText}>₹10</Text> for every signup
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EEFBF8",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "#CCFBF1",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  megaphoneIcon: {
    transform: [{ rotate: "-15deg" }],
  },
  centerCol: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 3,
    paddingVertical: 2,
    height: 30,
  },
  linkText: {
    flex: 1,
    fontSize: 10.5,
    color: "#007A78",
    fontWeight: "600",
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    backgroundColor: "#E6F7F5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#007A78",
  },
  rightCol: {
    alignItems: "center",
    justifyContent: "center",
    width: 106,
    gap: 4,
  },
  referButton: {
    backgroundColor: "#005C54",
    width: "100%",
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.28)",
    borderBottomWidth: 1,
    borderBottomColor: "#003E38",
    shadowColor: "#003E38",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 2,
  },
  referButtonText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  earningsText: {
    fontSize: 9.5,
    color: "#0F766E",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 12,
  },
  boldText: {
    fontWeight: "800",
    color: "#005C54",
  },
});
