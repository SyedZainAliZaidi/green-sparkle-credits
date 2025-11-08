import { LucideIcon } from "lucide-react";

export type AchievementTier = "bronze" | "silver" | "gold" | "diamond";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string; // emoji
  creditsReward: number;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  credits: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  submissionDays: Date[];
  lastSubmission: Date;
}
