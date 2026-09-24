import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabbedSectionProps {
  description: string;
  judgingParameters: string[];
  rulesAndEligibility: string[];
}

type ActiveTab = "about" | "judging" | "rules";

export const TabbedSection: React.FC<TabbedSectionProps> = ({
  description,
  judgingParameters,
  rulesAndEligibility,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("about");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <View style={styles.card}>
      {/* Tabs Header with segmented pill look */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "about" && styles.tabButtonActive]}
          onPress={() => setActiveTab("about")}
          activeOpacity={0.75}
        >
          <Text
            style={[styles.tabText, activeTab === "about" && styles.tabTextActive]}
          >
            About
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "judging" && styles.tabButtonActive]}
          onPress={() => setActiveTab("judging")}
          activeOpacity={0.75}
        >
          <Text
            style={[styles.tabText, activeTab === "judging" && styles.tabTextActive]}
          >
            Judging
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "rules" && styles.tabButtonActive]}
          onPress={() => setActiveTab("rules")}
          activeOpacity={0.75}
        >
          <Text
            style={[styles.tabText, activeTab === "rules" && styles.tabTextActive]}
          >
            Rules & Eligibility
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === "about" && (
          <View>
            <Text
              style={styles.bodyText}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {description}
            </Text>

            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                {isExpanded ? "View less" : "View more details"}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={14}
                color="#007A78"
              />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "judging" && (
          <View style={styles.listContainer}>
            {judgingParameters?.map((param, index) => (
              <View key={`param-${index}`} style={styles.listItem}>
                <View style={styles.bulletSquircle}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color="#007A78"
                  />
                </View>
                <Text style={styles.listItemText}>{param}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "rules" && (
          <View style={styles.listContainer}>
            {rulesAndEligibility?.map((rule, index) => (
              <View key={`rule-${index}`} style={styles.listItem}>
                <View style={[styles.bulletSquircle, styles.shieldSquircle]}>
                  <Ionicons
                    name="shield-checkmark"
                    size={12}
                    color="#007A78"
                  />
                </View>
                <Text style={styles.listItemText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#005C54",
    fontWeight: "800",
  },
  contentContainer: {
    paddingVertical: 2,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: "#334155",
    letterSpacing: -0.1,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 4,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#007A78",
  },
  listContainer: {
    gap: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletSquircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#E6F7F5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  shieldSquircle: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#334155",
  },
});
