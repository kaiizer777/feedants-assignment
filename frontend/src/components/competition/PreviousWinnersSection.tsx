import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { PreviousWinner } from "../../types/competition";

const WINNER_FALLBACK_IMAGES: Record<string, any> = {
  "Riya Shah": require("../../../assets/images/winner_riya_shah.jpg"),
  "Aarav Mehta": require("../../../assets/images/winner_aarav_mehta.jpg"),
  "Neha Verma": require("../../../assets/images/winner_neha_verma.jpg"),
  "Ishita Chopra": require("../../../assets/images/winner_ishita_chopra.jpg"),
};

interface PreviousWinnersSectionProps {
  winners: PreviousWinner[];
  onWinnerPress?: (winner: PreviousWinner) => void;
}

export const PreviousWinnersSection: React.FC<PreviousWinnersSectionProps> = ({
  winners,
  onWinnerPress,
}) => {
  if (!winners || winners.length === 0) return null;

  const getRankBadgeStyle = (rankText: string) => {
    const lower = rankText.toLowerCase();
    if (lower.includes("1st") || lower.includes("first")) {
      return {
        bg: "#FEF3C7",
        border: "#FDE68A",
        text: "#92400E",
        icon: "trophy" as const,
      };
    }
    if (lower.includes("2nd") || lower.includes("second")) {
      return {
        bg: "#F1F5F9",
        border: "#E2E8F0",
        text: "#475569",
        icon: "medal" as const,
      };
    }
    return {
      bg: "#FFEDD5",
      border: "#FED7AA",
      text: "#9A3412",
      icon: "ribbon" as const,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Previous Winners</Text>
        <Text style={styles.subtitle}>Watch winning performances</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {winners.map((winner, index) => {
          const imageSource =
            winner.imageUrl && !winner.imageUrl.includes("unsplash.com")
              ? { uri: winner.imageUrl }
              : WINNER_FALLBACK_IMAGES[winner.name] || { uri: winner.imageUrl };

          const badge = getRankBadgeStyle(winner.rank);

          return (
            <TouchableOpacity
              key={`${winner.name}-${index}`}
              style={styles.winnerCard}
              onPress={() => onWinnerPress?.(winner)}
              activeOpacity={0.82}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={imageSource}
                  style={styles.winnerImage}
                  contentFit="cover"
                  priority="high"
                  cachePolicy="memory-disk"
                />

                {/* Tactile Play overlay at bottom-right corner */}
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={10} color="#007A78" style={{ marginLeft: 1 }} />
                </View>
              </View>

              <View style={styles.winnerInfo}>
                <View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: badge.bg, borderColor: badge.border },
                  ]}
                >
                  <Text style={[styles.rankBadgeText, { color: badge.text }]}>
                    {winner.rank}
                  </Text>
                </View>

                <Text style={styles.winnerName} numberOfLines={1}>
                  {winner.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  winnerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    minWidth: 162,
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  winnerImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  playOverlay: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#99F6E4",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 2,
  },
  winnerInfo: {
    justifyContent: "center",
    paddingRight: 6,
    gap: 3,
  },
  rankBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  winnerName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
});
