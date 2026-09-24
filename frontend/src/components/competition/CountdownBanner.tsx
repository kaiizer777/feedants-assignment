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

  useEffect(() => {
    if (!isExpired) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
  }, [isExpired, pulseAnim]);

  return (
    <View style={styles.banner}>
      {/* Left section: Hourglass icon + Label */}
      <View style={styles.left}>
        <Ionicons name="hourglass-outline" size={16} color="#007A78" />
        <Text style={styles.label}>
          {isExpired ? "Registration ended" : "Registration closes in"}
        </Text>
      </View>

      {/* Center: Live Countdown or Closed state with Tabular Numbers */}
      <Text style={styles.timerText}>
        {isExpired ? "00d : 00h : 00m : 00s" : formatted}
      </Text>

      {/* Right: Hurry up badge with animated micro-pulse */}
      <View style={styles.right}>
        <Animated.View style={{ transform: [{ scale: isExpired ? 1 : pulseAnim }] }}>
          <Ionicons
            name={isExpired ? "alert-circle-outline" : "stopwatch-outline"}
            size={16}
            color={isExpired ? "#EF4444" : "#00897B"}
          />
        </Animated.View>
        <Text style={[styles.hurryText, isExpired && styles.expiredText]}>
          {isExpired ? "Closed" : "Hurry up!"}
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
    paddingVertical: 11,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderTopColor: "#E6FFFA",
    shadowColor: "#007A78",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  timerText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#005C54",
    letterSpacing: 0.4,
    fontVariant: ["tabular-nums"],
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hurryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#00897B",
  },
  expiredText: {
    color: "#EF4444",
  },
});
