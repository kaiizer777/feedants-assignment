import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface BottomTabBarProps {
  activeTab?: "home" | "explore" | "add" | "competitions" | "profile";
  onTabPress?: (tab: string) => void;
  userAvatarUrl?: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = "competitions",
  onTabPress,
  userAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("home")}
        activeOpacity={0.7}
      >
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={20}
          color={activeTab === "home" ? "#007A78" : "#64748B"}
        />
        <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("explore")}
        activeOpacity={0.7}
      >
        <Ionicons
          name={activeTab === "explore" ? "search" : "search-outline"}
          size={20}
          color={activeTab === "explore" ? "#007A78" : "#64748B"}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "explore" && styles.tabLabelActive,
          ]}
        >
          Explore
        </Text>
      </TouchableOpacity>

      {/* 3. Center Add (+) Button */}
      <TouchableOpacity
        style={styles.centerAddWrapper}
        onPress={() => onTabPress?.("add")}
        activeOpacity={0.85}
      >
        <View style={styles.centerAddButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("competitions")}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trophy"
          size={20}
          color={activeTab === "competitions" ? "#007A78" : "#64748B"}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "competitions" && styles.tabLabelActive,
          ]}
        >
          Competitions
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("profile")}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: userAvatarUrl }}
          style={[
            styles.profileAvatar,
            activeTab === "profile" && styles.profileAvatarActive,
          ]}
          contentFit="cover"
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "profile" && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 6,
    paddingBottom: 6,
    height: 58,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 58,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  tabLabelActive: {
    color: "#007A78",
    fontWeight: "700",
  },
  centerAddWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginTop: -12,
  },
  centerAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#005C54",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.32)",
    borderBottomWidth: 2.5,
    borderBottomColor: "#002B27",
    shadowColor: "#002B27",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  profileAvatarActive: {
    borderColor: "#007A78",
  },
});
