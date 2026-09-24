import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FeedbackModalProps {
  visible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
}) => {
  const isSuccess = type === "success";
  const isError = type === "error";

  const iconName = isSuccess
    ? "checkmark-circle"
    : isError
    ? "alert-circle"
    : "information-circle";

  const iconColor = isSuccess
    ? "#007A78"
    : isError
    ? "#DC2626"
    : "#0284C7";

  const buttonBg = isError ? "#DC2626" : "#005C54";
  const buttonBottomColor = isError ? "#991B1B" : "#002B27";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}15` }]}>
            <Ionicons name={iconName} size={36} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: buttonBg,
                borderBottomColor: buttonBottomColor,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.35)",
    borderBottomWidth: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
});
