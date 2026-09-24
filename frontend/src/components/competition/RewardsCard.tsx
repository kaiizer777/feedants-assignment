import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RewardItem } from "../../types/competition";
import { formatCurrency } from "../../utils/formatters";

interface RewardsCardProps {
  rewards: RewardItem[];
}

export const RewardsCard: React.FC<RewardsCardProps> = ({ rewards }) => {
  if (!rewards || rewards.length === 0) return null;

  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Ionicons name="trophy" size={17} color="#D97706" />,
          bgColor: "#FEF3C7",
          borderColor: "#FDE68A",
          title: "1st Winner",
          highlightRow: true,
        };
      case 2:
        return {
          icon: <Ionicons name="medal" size={17} color="#64748B" />,
          bgColor: "#F1F5F9",
          borderColor: "#E2E8F0",
          title: "2nd Winner",
          highlightRow: false,
        };
      case 3:
        return {
          icon: <Ionicons name="medal" size={17} color="#EA580C" />,
          bgColor: "#FFEDD5",
          borderColor: "#FED7AA",
          title: "3rd Winner",
          highlightRow: false,
        };
      default:
        return {
          icon: <Ionicons name="star" size={16} color="#007A78" />,
          bgColor: "#E6F7F5",
          borderColor: "#CCFBF1",
          title: `${rank}th Winner`,
          highlightRow: false,
        };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>All Positions</Text>
        </View>
        <View style={styles.guaranteedPill}>
          <Ionicons name="checkmark-circle" size={12} color="#007A78" />
          <Text style={styles.guaranteedText}>Guaranteed</Text>
        </View>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, index) => {
          const config = getRankConfig(reward.rank);

          return (
            <View
              key={`reward-${reward.rank}-${index}`}
              style={[
                styles.rewardRow,
                config.highlightRow && styles.firstRowHighlight,
                index !== rewards.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.left}>
                <View
                  style={[
                    styles.iconSquircle,
                    {
                      backgroundColor: config.bgColor,
                      borderColor: config.borderColor,
                    },
                  ]}
                >
                  {config.icon}
                </View>
                <Text style={styles.rankTitle}>
                  {reward.title || config.title}
                </Text>
              </View>

              <Text
                style={[
                  styles.amountText,
                  config.highlightRow && styles.firstAmountText,
                ]}
              >
                {formatCurrency(reward.amount)}
              </Text>
            </View>
          );
        })}
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
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  guaranteedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F7F5",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  guaranteedText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#007A78",
  },
  list: {
    gap: 0,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  firstRowHighlight: {
    backgroundColor: "rgba(254, 243, 199, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconSquircle: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  rankTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#007A78",
    fontVariant: ["tabular-nums"],
  },
  firstAmountText: {
    fontSize: 16.5,
    fontWeight: "900",
    color: "#005C54",
  },
});
