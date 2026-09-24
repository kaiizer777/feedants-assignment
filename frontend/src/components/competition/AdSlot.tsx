import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const AdSlot: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="megaphone-outline" size={15} color="#94A3B8" />
      <Text style={styles.text}>Ad Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
});
