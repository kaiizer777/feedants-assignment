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
        activeOpacity={0.75}
      >
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={20}
          color={activeTab === "home" ? "#007A78" : "#64748B"}
        />
        <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>
          Home
        </Text>
        {activeTab === "home" && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("explore")}
        activeOpacity={0.75}
      >
        <Ionicons
          name={activeTab === "explore" ? "compass" : "compass-outline"}
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
        {activeTab === "explore" && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* 3. Center Add (+) Button */}
      <TouchableOpacity
        style={styles.centerAddWrapper}
        onPress={() => onTabPress?.("add")}
        activeOpacity={0.88}
      >
        <View style={styles.centerAddButton}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("competitions")}
        activeOpacity={0.75}
      >
        <Ionicons
          name={activeTab === "competitions" ? "trophy" : "trophy-outline"}
          size={20}
          color={activeTab === "competitions" ? "#007A78" : "#64748B"}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "competitions" && styles.tabLabelActive,
          ]}
        >
          Contests
        </Text>
        {activeTab === "competitions" && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress?.("profile")}
        activeOpacity={0.75}
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
        {activeTab === "profile" && <View style={styles.activeDot} />}
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
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
    paddingBottom: 6,
    height: 58,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 58,
    position: "relative",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  tabLabelActive: {
    color: "#007A78",
    fontWeight: "800",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007A78",
    marginTop: 1,
  },
  centerAddWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginTop: -14,
  },
  centerAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#005C54",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    borderBottomWidth: 2.5,
    borderBottomColor: "#002B27",
    shadowColor: "#002B27",
    shadowOffset: { width: 0, height: 3.5 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
    elevation: 6,
  },
  profileAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  profileAvatarActive: {
    borderColor: "#007A78",
  },
});
