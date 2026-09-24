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
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="cloud-upload-outline" size={22} color="#007A78" />
              <Text style={styles.title}>Upload Submission</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Submit your classical dance entry for judging. You can provide notes, a video URL (YouTube, Drive, Vimeo), or both.
          </Text>

          {validationError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          )}

          {/* Performance Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Performance Notes / Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Kathak Teentaal Thaat & Tukdas performance"
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
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Submit Entry</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
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
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
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
    fontWeight: "600",
    color: "#374151",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#111827",
    minHeight: 70,
    textAlignVertical: "top",
    backgroundColor: "#F8FAFC",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#F8FAFC",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
    backgroundColor: "#006466",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 110,
    alignItems: "center",
  },
  submitText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
