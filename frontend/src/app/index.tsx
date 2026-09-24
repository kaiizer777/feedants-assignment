import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { MOCK_USERS } from "../constants/mockUsers";
import { useCompetition } from "../hooks/useCompetition";
import { Header } from "../components/competition/Header";
import { InfoCard } from "../components/competition/InfoCard";
import { JudgeCard } from "../components/competition/JudgeCard";
import { CountdownBanner } from "../components/competition/CountdownBanner";
import { ImportantDatesCard } from "../components/competition/ImportantDatesCard";
import { PreviousWinnersSection } from "../components/competition/PreviousWinnersSection";
import { TabbedSection } from "../components/competition/TabbedSection";
import { RewardsCard } from "../components/competition/RewardsCard";
import { DisclaimerBanner } from "../components/competition/DisclaimerBanner";
import { TrustInfoSection } from "../components/competition/TrustInfoSection";
import { ReferAndEarnCard } from "../components/competition/ReferAndEarnCard";
import { TestimonialsRow } from "../components/competition/TestimonialsRow";
import { AdSlot } from "../components/competition/AdSlot";
import { BottomActionBar } from "../components/competition/BottomActionBar";
import { BottomTabBar } from "../components/competition/BottomTabBar";
import { SubmissionModal } from "../components/competition/SubmissionModal";
import { FeedbackModal } from "../components/competition/FeedbackModal";
import { VideoModal } from "../components/competition/VideoModal";
import { LoadingSkeleton } from "../components/competition/LoadingSkeleton";
import { ErrorView } from "../components/competition/ErrorView";

const JUDGE_IMAGE = require("../../assets/images/judge_manju_dubey.jpg");
const WINNER_IMAGES: Record<string, any> = {
  "Riya Shah": require("../../assets/images/winner_riya_shah.jpg"),
  "Aarav Mehta": require("../../assets/images/winner_aarav_mehta.jpg"),
  "Neha Verma": require("../../assets/images/winner_neha_verma.jpg"),
  "Ishita Chopra": require("../../assets/images/winner_ishita_chopra.jpg"),
};

export default function CompetitionDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string; user?: string }>();
  const competitionId = typeof params.id === "string" && params.id.trim() ? params.id.trim() : undefined;
  const initialUser = params.user === "ananya" ? MOCK_USERS[1] : MOCK_USERS[0];

  const {
    competition,
    loading,
    error,
    activeUser,
    setActiveUser,
    refetch,
    register,
    submitEntry,
    isActionLoading,
  } = useCompetition(competitionId);

  // Sync initial user if passed via URL param
  React.useEffect(() => {
    if (params.user === "ananya") {
      setActiveUser(MOCK_USERS[1]);
    }
  }, [params.user, setActiveUser]);

  const [selectedLanguage, setSelectedLanguage] = useState<"ENG" | "HINDI">("ENG");
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);
  const [videoModal, setVideoModal] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
    thumbnailUrl?: any;
  }>({
    visible: false,
    title: "",
    subtitle: "",
  });
  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const openVideo = (title: string, subtitle: string, thumbnailUrl?: any) => {
    setVideoModal({
      visible: true,
      title,
      subtitle,
      thumbnailUrl,
    });
  };

  const closeVideo = () => {
    setVideoModal((prev) => ({ ...prev, visible: false }));
  };

  const showFeedback = (
    type: "success" | "error" | "info",
    title: string,
    message: string
  ) => {
    setFeedbackModal({
      visible: true,
      type,
      title,
      message,
    });
  };

  const closeFeedback = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

  const handleRegister = async () => {
    const result = await register();
    if (result.success) {
      showFeedback(
        "success",
        "Registration Successful! 🎉",
        "You have been registered for Feedants Classical Dance. Your spot is confirmed."
      );
    } else {
      showFeedback(
        "error",
        "Registration Failed",
        result.error || "Unable to complete registration. Please try again."
      );
    }
  };

  const handleOpenSubmission = () => {
    setIsSubmissionModalOpen(true);
  };

  const handleSubmitEntry = async (payload: {
    content?: string;
    mediaUrl?: string;
  }) => {
    const result = await submitEntry(payload);
    setIsSubmissionModalOpen(false);
    if (result.success) {
      showFeedback(
        "success",
        "Submission Received! 🌟",
        "Your classical dance entry has been uploaded and submitted for judging."
      );
    } else {
      showFeedback(
        "error",
        "Submission Failed",
        result.error || "Unable to upload submission. Please check your inputs."
      );
    }
  };

  const handleStubAction = (title: string, message: string) => {
    showFeedback("info", title, message);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.rootCanvas}>
        {/* Header: Go Back & Language Toggle */}
        <Header
          selectedLanguage={selectedLanguage}
          onToggleLanguage={setSelectedLanguage}
          onBackPress={() =>
            handleStubAction(
              "Navigation",
              "Navigating back to Feedants contests listing."
            )
          }
        />

        {/* Screen Body */}
        {loading && !competition ? (
          <LoadingSkeleton />
        ) : error && !competition ? (
          <ErrorView error={error} onRetry={refetch} />
        ) : competition ? (
          <View style={styles.contentFlex}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 3. Info Card */}
              <InfoCard competition={competition} />

              {/* 4. Judge Card */}
              <JudgeCard
                judge={competition.judge}
                onPlayPress={() =>
                  openVideo(
                    `Judge Intro: ${competition.judge?.name || "Manju Dubey"}`,
                    "Kathak Mastery & Judging Criteria",
                    JUDGE_IMAGE
                  )
                }
              />

              {/* 5. Countdown Banner */}
              <CountdownBanner registerBy={competition.registerBy} />

              {/* 6. Important Dates Card */}
              <ImportantDatesCard
                registerBy={competition.registerBy}
                submissionStart={competition.submissionStart}
                submissionEnd={competition.submissionEnd}
                resultDate={competition.resultDate}
              />

              {/* 7. Previous Winners Section */}
              <PreviousWinnersSection
                winners={competition.previousWinners}
                onWinnerPress={(winner) =>
                  openVideo(
                    `${winner.name} (${winner.rank})`,
                    "Winning Kathak Performance Clip",
                    WINNER_IMAGES[winner.name] || (winner.imageUrl ? { uri: winner.imageUrl } : null)
                  )
                }
              />

              {/* 8. Tabbed Section */}
              <TabbedSection
                description={competition.description}
                judgingParameters={competition.judgingParameters}
                rulesAndEligibility={competition.rulesAndEligibility}
              />

              {/* 9. Rewards Card */}
              <RewardsCard rewards={competition.rewards} />

              {/* 10. Disclaimer Banner */}
              <DisclaimerBanner />

              {/* 11. Trust & Policy Cards */}
              <TrustInfoSection
                onHowItWorksPress={() =>
                  openVideo(
                    "Prize Money Distribution",
                    "Direct UPI / Bank Transfer within 48h of results",
                    null
                  )
                }
                onRefundPolicyPress={() =>
                  handleStubAction(
                    "Refund Policy",
                    "Registrations are 100% refundable if the competition is cancelled or rescheduled by Feedants."
                  )
                }
              />

              {/* 12. Refer & Earn Card */}
              <ReferAndEarnCard
                referralUrl="https://feedants.com/r/referral123"
                onReferNow={() =>
                  handleStubAction(
                    "Referral Link",
                    "Referral link copied to clipboard! Share with your friends to earn ₹10 per signup."
                  )
                }
              />

              {/* 13. Testimonials Row */}
              <TestimonialsRow
                onPress={() =>
                  handleStubAction(
                    "User Testimonials",
                    "Reviews from previous classical dance participants across India."
                  )
                }
              />

              {/* 14. Ad Slot Placeholder */}
              <AdSlot />
            </ScrollView>

            {/* 15. Sticky Primary Action Bar */}
            <BottomActionBar
              competition={competition}
              isLoading={isActionLoading}
              onRegisterPress={handleRegister}
              onSubmitPress={handleOpenSubmission}
            />
          </View>
        ) : null}

        {/* 16. Fixed Bottom Tab Bar (Home / Explore / + / Competitions / Profile) */}
        <BottomTabBar
          activeTab="competitions"
          userAvatarUrl={activeUser.avatarUrl}
          onTabPress={(tab) => {
            if (tab === "profile") {
              const nextUser = activeUser.id === MOCK_USERS[0].id ? MOCK_USERS[1] : MOCK_USERS[0];
              setActiveUser(nextUser);
              showFeedback(
                "info",
                `Switched to ${nextUser.name.split(" ")[0]}`,
                `Now previewing as ${nextUser.roleDescription}`
              );
            } else if (tab !== "competitions") {
              handleStubAction(
                "Tab Navigation",
                `Navigating to ${tab.toUpperCase()} screen (mock tab per assignment scope).`
              );
            }
          }}
        />

        {/* Submission Modal */}
        <SubmissionModal
          visible={isSubmissionModalOpen}
          isLoading={isActionLoading}
          onClose={() => setIsSubmissionModalOpen(false)}
          onSubmit={handleSubmitEntry}
        />

        {/* Video Player Modal */}
        <VideoModal
          visible={videoModal.visible}
          title={videoModal.title}
          subtitle={videoModal.subtitle}
          thumbnailUrl={videoModal.thumbnailUrl}
          onClose={closeVideo}
        />

        {/* Feedback Alert Dialog */}
        <FeedbackModal
          visible={feedbackModal.visible}
          type={feedbackModal.type}
          title={feedbackModal.title}
          message={feedbackModal.message}
          onClose={closeFeedback}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  rootCanvas: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    ...(Platform.OS === "web"
      ? {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#E2E8F0",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }
      : {}),
  },
  contentFlex: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
