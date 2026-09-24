import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MockUser } from "../../types/competition";
import { MOCK_USERS } from "../../constants/mockUsers";

interface DevUserBarProps {
  currentUser: MockUser;
  onSelectUser: (user: MockUser) => void;
}

export const DevUserBar: React.FC<DevUserBarProps> = ({
  currentUser,
  onSelectUser,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.devTag}>
          <Text style={styles.devTagText}>DEV AUTH</Text>
        </View>
        <Image
          source={{ uri: currentUser.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {currentUser.name}
          </Text>
          <Text style={styles.userRole} numberOfLines={1}>
            {currentUser.roleDescription}
          </Text>
        </View>
      </View>

      <View style={styles.switchers}>
        {MOCK_USERS.map((user) => {
          const isActive = user.token === currentUser.token;
          return (
            <TouchableOpacity
              key={user.id}
              style={[styles.switchButton, isActive && styles.switchButtonActive]}
              onPress={() => onSelectUser(user)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? "checkmark-circle" : "person-outline"}
                size={12}
                color={isActive ? "#FFFFFF" : "#0F766E"}
              />
              <Text
                style={[
                  styles.switchButtonText,
                  isActive && styles.switchButtonTextActive,
                ]}
              >
                {user.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDFA",
    borderBottomWidth: 1,
    borderBottomColor: "#CCFBF1",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  devTag: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  devTagText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#14B8A6",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F766E",
  },
  userRole: {
    fontSize: 9,
    color: "#115E59",
    fontWeight: "500",
  },
  switchers: {
    flexDirection: "row",
    gap: 4,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  switchButtonActive: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  switchButtonText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#0F766E",
  },
  switchButtonTextActive: {
    color: "#FFFFFF",
  },
});
