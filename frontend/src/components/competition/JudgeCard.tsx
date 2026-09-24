import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { JudgeInfo } from "../../types/competition";

const DEFAULT_JUDGE_AVATAR = require("../../../assets/images/judge_manju_dubey.jpg");

interface JudgeCardProps {
  judge: JudgeInfo;
  onPlayPress?: () => void;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge, onPlayPress }) => {
  const avatarSource =
    judge?.avatarUrl && !judge.avatarUrl.includes("photo-1573496359142")
      ? { uri: judge.avatarUrl }
      : DEFAULT_JUDGE_AVATAR;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.avatarWrapper}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
          />
          <View style={styles.verifiedDot}>
            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.judgeBadgeRow}>
            <Text style={styles.judgeLabel}>Official Judge</Text>
          </View>
          <Text style={styles.judgeName}>{judge?.name || "Manju Dubey"}</Text>
          <Text style={styles.judgeTitle}>
            {judge?.title || "Professional Kathak Dancer"}
          </Text>
          <Text style={styles.judgeBio}>
            {judge?.bio || "12+ Years of Experience"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.videoButtonContainer}
        onPress={onPlayPress}
        activeOpacity={0.8}
      >
        <View style={styles.playCircle}>
          <Ionicons name="play" size={16} color="#007A78" style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoLabel}>Watch Intro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
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
    shadowRadius: 8,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E2E8F0",
    borderWidth: 2,
    borderColor: "#F1F5F9",
  },
  verifiedDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#007A78",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  info: {
    flex: 1,
  },
  judgeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 1,
  },
  judgeLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#007A78",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  judgeName: {
    fontSize: 16.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  judgeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginTop: 1.5,
  },
  judgeBio: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
    fontWeight: "500",
  },
  videoButtonContainer: {
    alignItems: "center",
    gap: 4,
    paddingLeft: 8,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1.5,
    borderBottomColor: "#5EEAD4",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 2,
  },
  videoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#007A78",
  },
});
