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
      activeOpacity={0.75}
    >
      <View style={styles.left}>
        <Ionicons name="chatbubble-outline" size={20} color="#0F172A" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hear From Our Users</Text>
          <Text style={styles.subtitle}>
            See what participants say about Feedants
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#64748B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderTopColor: "#FFFFFF",
    shadowColor: "#0D2B2A",
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
  textContainer: {
    gap: 2,
    flex: 1,
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
});
