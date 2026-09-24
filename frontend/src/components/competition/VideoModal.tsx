import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface VideoModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  thumbnailUrl?: any;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  visible,
  title,
  subtitle,
  thumbnailUrl,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleColumn}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Preview Box */}
          <View style={styles.videoPlayerBox}>
            {thumbnailUrl ? (
              <Image
                source={thumbnailUrl}
                style={styles.videoThumbnail}
                contentFit="cover"
              />
            ) : (
              <View style={styles.fallbackBox}>
                <Ionicons name="film-outline" size={48} color="#94A3B8" />
              </View>
            )}

            {/* Dark gradient overlay */}
            <View style={styles.overlay} />

            {/* Center Play / Pause Button */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={28}
                color="#FFFFFF"
                style={{ marginLeft: isPlaying ? 0 : 2 }}
              />
            </TouchableOpacity>

            {/* Bottom scrubber simulation */}
            <View style={styles.controlsBar}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: isPlaying ? "45%" : "0%" }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{isPlaying ? "01:14" : "00:00"}</Text>
                <Text style={styles.timeText}>02:45</Text>
              </View>
            </View>
          </View>

          {/* Footer note */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={15} color="#00897B" />
            <Text style={styles.footerText}>
              Official Feedants classical dance preview feed
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  titleColumn: {
    flex: 1,
    paddingRight: 10,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlayerBox: {
    width: "100%",
    height: 240,
    position: "relative",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  videoThumbnail: {
    ...StyleSheet.absoluteFill,
  },
  fallbackBox: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 92, 102, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  controlsBar: {
    position: "absolute",
    bottom: 10,
    left: 14,
    right: 14,
    gap: 4,
  },
  progressBarTrack: {
    width: "100%",
    height: 3.5,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#00897B",
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 10,
    color: "#E2E8F0",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
