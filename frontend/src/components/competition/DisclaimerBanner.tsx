import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const DisclaimerBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Ionicons
        name="information-circle-outline"
        size={18}
        color="#00897B"
        style={styles.icon}
      />
      <Text style={styles.text}>
        <Text style={styles.boldText}>Disclaimer: </Text>
        Only contributions from paid participants will be considered for judging.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#EEFBF8",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "#CCFBF1",
    gap: 8,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#0F766E",
    fontWeight: "500",
  },
  boldText: {
    fontWeight: "800",
    color: "#005C54",
  },
});
