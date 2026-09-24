import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCountdown } from "../../hooks/useCountdown";

interface CountdownBannerProps {
  registerBy: string | Date | undefined;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  registerBy,
}) => {
  const { formatted, isExpired } = useCountdown(registerBy);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isExpired) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );

      const dotLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0.35,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );

      pulseLoop.start();
      dotLoop.start();

      return () => {
        pulseLoop.stop();
        dotLoop.stop();
      };
    }
  }, [isExpired, pulseAnim, dotOpacity]);

  return (
    <View style={styles.banner}>
      {/* Left section: Live dot + Label */}
      <View style={styles.left}>
        {!isExpired ? (
          <Animated.View style={[styles.liveDot, { opacity: dotOpacity }]} />
        ) : (
          <Ionicons name="time-outline" size={15} color="#DC2626" />
        )}
        <Text style={styles.label}>
          {isExpired ? "Registration ended" : "Closes in"}
        </Text>
      </View>

      {/* Center: Live Countdown with Tabular Numbers */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, isExpired && styles.timerExpiredText]}>
          {isExpired ? "00d : 00h : 00m : 00s" : formatted}
        </Text>
      </View>

      {/* Right: Hurry up badge with animated micro-pulse */}
      <View style={[styles.rightBadge, isExpired && styles.expiredBadge]}>
        <Animated.View style={{ transform: [{ scale: isExpired ? 1 : pulseAnim }] }}>
          <Ionicons
            name={isExpired ? "alert-circle" : "flame"}
            size={13}
            color={isExpired ? "#DC2626" : "#007A78"}
          />
        </Animated.View>
        <Text style={[styles.hurryText, isExpired && styles.expiredText]}>
          {isExpired ? "Closed" : "Hurry!"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#EEFBF8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00897B",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F766E",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#005C54",
    letterSpacing: 0.5,
    fontVariant: ["tabular-nums"],
  },
  timerExpiredText: {
    color: "#DC2626",
  },
  rightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F7F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  expiredBadge: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
  hurryText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#007A78",
    letterSpacing: 0.1,
  },
  expiredText: {
    color: "#DC2626",
  },
});
