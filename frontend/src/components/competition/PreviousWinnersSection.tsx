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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Winners</Text>

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

          return (
            <TouchableOpacity
              key={`${winner.name}-${index}`}
              style={styles.winnerCard}
              onPress={() => onWinnerPress?.(winner)}
              activeOpacity={0.8}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={imageSource}
                  style={styles.winnerImage}
                  contentFit="cover"
                  priority="high"
                  cachePolicy="memory-disk"
                />
                {/* Mini play icon overlay at bottom-right corner matching Objective_Page.png */}
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={10} color="#007A78" style={{ marginLeft: 1.5 }} />
                </View>
              </View>

              <View style={styles.winnerInfo}>
                <Text style={styles.winnerName} numberOfLines={1}>
                  {winner.name}
                </Text>
                <Text style={styles.winnerRank} numberOfLines={1}>
                  {winner.rank}
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
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    paddingHorizontal: 16,
    marginBottom: 12,
    letterSpacing: -0.2,
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
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    minWidth: 156,
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  winnerImage: {
    width: 56,
    height: 56,
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
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  winnerInfo: {
    justifyContent: "center",
    paddingRight: 6,
  },
  winnerName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  winnerRank: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#007A78",
  },
});
