import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TestimonialsRowProps {
  onPress?: () => void;
}

export const TestimonialsRow: React.FC<TestimonialsRowProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={styles.iconSquircle}>
          <Ionicons name="chatbubbles" size={17} color="#007A78" />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.starsRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={11} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.ratingText}>4.9/5 • 1,200+ Reviews</Text>
          </View>
          <Text style={styles.title}>Hear From Our Dancers</Text>
          <Text style={styles.subtitle}>
            Read experiences & tips from past participants
          </Text>
        </View>
      </View>

      <View style={styles.chevronCircle}>
        <Ionicons name="chevron-forward" size={14} color="#007A78" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconSquircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  textContainer: {
    gap: 1.5,
    flex: 1,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 1,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  },
  ratingText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#0F766E",
  },
  title: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginLeft: 6,
  },
});
