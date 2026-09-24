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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Ionicons name="trophy" size={18} color="#EAB308" />;
      case 2:
        return <Ionicons name="medal" size={18} color="#94A3B8" />;
      case 3:
        return <Ionicons name="medal" size={18} color="#D97706" />;
      default:
        return <Ionicons name="star-outline" size={18} color="#00897B" />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>(All Positions)</Text>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View
            key={`reward-${reward.rank}-${index}`}
            style={[
              styles.rewardRow,
              index !== rewards.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.left}>
              <View style={styles.iconContainer}>{getRankIcon(reward.rank)}</View>
              <Text style={styles.rankTitle}>
                {reward.title || `${reward.rank}th Winner`}
              </Text>
            </View>

            <Text style={styles.amountText}>{formatCurrency(reward.amount)}</Text>
          </View>
        ))}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
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
    fontWeight: "500",
  },
  list: {
    gap: 0,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
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
  iconContainer: {
    width: 24,
    alignItems: "center",
  },
  rankTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  amountText: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#007A78",
    fontVariant: ["tabular-nums"],
  },
});
