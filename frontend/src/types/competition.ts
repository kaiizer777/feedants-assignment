export interface RewardItem {
  rank: number;
  amount: number;
  title: string;
}

export interface JudgeInfo {
  name: string;
  title: string;
  bio: string;
  introVideoUrl?: string;
  avatarUrl?: string;
}

export interface PreviousWinner {
  name: string;
  rank: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface SubmissionData {
  submittedAt?: string | Date;
  content?: string;
  mediaUrl?: string;
}

export interface UserRegistrationState {
  isRegistered: boolean;
  status: "not_registered" | "registered" | "submitted";
  registeredAt?: string | Date | null;
  hasSubmitted: boolean;
  submission?: SubmissionData | null;
}

export interface Competition {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  spotsTaken: number;
  spotsRemaining: number;
  registerBy: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
  rewards: RewardItem[];
  judge: JudgeInfo;
  rulesAndEligibility: string[];
  judgingParameters: string[];
  previousWinners: PreviousWinner[];
  bannerUrl?: string;
  certificateProvided?: boolean;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  lifecycleState:
    | "upcoming"
    | "registration_open"
    | "registration_closed"
    | "submission_open"
    | "submission_closed"
    | "results_declared";
  userRegistration: UserRegistrationState;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  token: string;
  roleDescription: string;
  avatarUrl: string;
}
