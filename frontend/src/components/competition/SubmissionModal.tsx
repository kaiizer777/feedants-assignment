import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SubmissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { content?: string; mediaUrl?: string }) => Promise<void>;
  isLoading: boolean;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [content, setContent] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() && !mediaUrl.trim()) {
      setValidationError("Please enter a performance description or media URL");
      return;
    }

    setValidationError(null);
    await onSubmit({
      content: content.trim() || undefined,
      mediaUrl: mediaUrl.trim() || undefined,
    });
    // Clear inputs on submit
    setContent("");
    setMediaUrl("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Top Grab Handle */}
          <View style={styles.grabHandle} />

          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconSquircle}>
                <Ionicons name="cloud-upload" size={18} color="#007A78" />
              </View>
              <Text style={styles.title}>Submit Entry</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Submit your classical dance routine for evaluation by Manju Dubey. Provide performance notes, a video link (Drive/YouTube/Vimeo), or both.
          </Text>

          {validationError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={15} color="#DC2626" />
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          )}

          {/* Performance Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Performance Notes / Choreography</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Kathak Teentaal Thaat, Tukdas & Tatkar demonstration"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                if (validationError) setValidationError(null);
              }}
            />
          </View>

          {/* Media URL Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Video / Drive URL</Text>
            <TextInput
              style={styles.textInput}
              placeholder="https://drive.google.com/... or youtube.com/..."
              placeholderTextColor="#94A3B8"
              value={mediaUrl}
              onChangeText={(text) => {
                setMediaUrl(text);
                if (validationError) setValidationError(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Submit Performance</Text>
              )}
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
  },
  grabHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconSquircle: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: "#0F172A",
    minHeight: 70,
    textAlignVertical: "top",
    backgroundColor: "#F8FAFC",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  submitButton: {
    backgroundColor: "#005C54",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    minWidth: 130,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.35)",
    borderBottomWidth: 2,
    borderBottomColor: "#002B27",
    shadowColor: "#002B27",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
