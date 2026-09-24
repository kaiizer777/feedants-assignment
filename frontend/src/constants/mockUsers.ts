import { MockUser } from "../types/competition";

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-unregistered",
    name: "Saif (Solo Dev)",
    email: "saif@example.com",
    token: "mock-user-demo-unregistered-2",
    roleDescription: "Unregistered (Can Test Register)",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  },
  {
    id: "user-registered",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    token: "mock-user-seed-registered-1",
    roleDescription: "Registered & Submitted",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
];

export const DEFAULT_COMPETITION_ID =
  process.env.EXPO_PUBLIC_DEFAULT_COMPETITION_ID || "6ab43aaaabd4bffa981a53c9";
