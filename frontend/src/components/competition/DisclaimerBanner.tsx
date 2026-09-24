import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const DisclaimerBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <View style={styles.iconCircle}>
        <Ionicons name="information" size={13} color="#007A78" />
      </View>
      <Text style={styles.text}>
        <Text style={styles.boldText}>Disclaimer: </Text>
        Only contributions from registered participants with valid entry fees will be evaluated for final ranking and rewards.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#EEFBF8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    gap: 10,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  text: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    color: "#0F766E",
    fontWeight: "500",
  },
  boldText: {
    fontWeight: "800",
    color: "#005C54",
  },
});
