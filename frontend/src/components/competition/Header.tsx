import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onBackPress?: () => void;
  selectedLanguage: "ENG" | "HINDI";
  onToggleLanguage: (lang: "ENG" | "HINDI") => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBackPress,
  selectedLanguage,
  onToggleLanguage,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back" size={20} color="#0F172A" />
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {/* Language Toggle matching Objective_Page.png */}
      <View style={styles.langToggleContainer}>
        <TouchableOpacity
          style={[
            styles.langPill,
            selectedLanguage === "ENG" && styles.langPillActive,
          ]}
          onPress={() => onToggleLanguage("ENG")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              selectedLanguage === "ENG" && styles.langTextActive,
            ]}
          >
            ENG
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langPill,
            selectedLanguage === "HINDI" && styles.langPillActive,
          ]}
          onPress={() => onToggleLanguage("HINDI")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              selectedLanguage === "HINDI" && styles.langTextActive,
            ]}
          >
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  langToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  langPillActive: {
    backgroundColor: "#005C54",
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
  langText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  langTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
