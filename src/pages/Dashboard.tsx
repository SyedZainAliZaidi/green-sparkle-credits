import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { AchievementModal } from "@/components/AchievementModal";
import { BadgeCollection } from "@/components/BadgeCollection";
import { StreakTracker } from "@/components/StreakTracker";
import { Leaderboard } from "@/components/Leaderboard";
import { Progress } from "@/components/ui/progress";
import { Coins, Leaf, Upload, TrendingUp, Award, TreePine, Zap, Wind, Camera } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { achievementsData } from "@/data/achievements";
import { Achievement, LeaderboardEntry, StreakData } from "@/types/achievements";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate achievement unlock on page load (for demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      const unlockedAchievement = achievementsData.find(a => a.id === "first_submission");
      if (unlockedAchievement && !showAchievementModal) {
        setSelectedAchievement(unlockedAchievement);
        setShowAchievementModal(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!hasData) {
    return (
      <div className="min-h-screen pb-20 bg-background animate-fade-in">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Impact Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and environmental impact</p>
          </div>
          <EmptyState
            icon={Camera}
            emoji="📸"
            title="Take your first photo to start earning!"
            description="Capture a photo of your clean cookstove to earn carbon credits and start tracking your environmental impact."
            actionLabel="Take Photo"
            onAction={() => navigate("/upload")}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Impact Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and environmental impact</p>
          </div>
          
          {/* Skeleton Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
          </div>

          {/* Skeleton Chart */}
          <SkeletonLoader type="chart" className="mb-6" />

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
          </div>
        </div>
      </div>
    );
  }
  const chartData = [
    { week: "Week 1", credits: 45 },
    { week: "Week 2", credits: 78 },
    { week: "Week 3", credits: 92 },
    { week: "Week 4", credits: 125 },
    { week: "Week 5", credits: 156 },
    { week: "Week 6", credits: 189 },
    { week: "Week 7", credits: 245 },
  ];

  // Mock data for leaderboard
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, userId: "1", username: "Sarah Green", credits: 1250, isCurrentUser: false },
    { rank: 2, userId: "2", username: "Mike Earth", credits: 1180, isCurrentUser: false },
    { rank: 3, userId: "3", username: "Emma Forest", credits: 980, isCurrentUser: false },
    { rank: 4, userId: "4", username: "You", credits: 245, isCurrentUser: true },
    { rank: 5, userId: "5", username: "John Climate", credits: 220, isCurrentUser: false },
    { rank: 6, userId: "6", username: "Lisa Solar", credits: 195, isCurrentUser: false },
    { rank: 7, userId: "7", username: "Tom Wind", credits: 175, isCurrentUser: false },
    { rank: 8, userId: "8", username: "Anna Eco", credits: 160, isCurrentUser: false },
    { rank: 9, userId: "9", username: "David Clean", credits: 145, isCurrentUser: false },
    { rank: 10, userId: "10", username: "Sophie Nature", credits: 130, isCurrentUser: false },
  ];

  // Mock streak data
  const streakData: StreakData = {
    currentStreak: 7,
    longestStreak: 12,
    submissionDays: [
      new Date(2025, 10, 1),
      new Date(2025, 10, 2),
      new Date(2025, 10, 3),
      new Date(2025, 10, 4),
      new Date(2025, 10, 5),
      new Date(2025, 10, 6),
      new Date(2025, 10, 7),
    ],
    lastSubmission: new Date(2025, 10, 7),
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Impact Dashboard</h1>
          <p className="text-muted-foreground">Track your earnings and environmental impact</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Coins}
            label="Total Credits"
            value="245"
            trend="+25 this week"
            gradient="green"
          />
          <StatCard
            icon={Leaf}
            label="CO₂ Prevented"
            value="1.2t"
            trend="This year"
            gradient="blue"
          />
          <StatCard
            icon={Upload}
            label="Submissions"
            value="18"
            trend="8 this month"
            gradient="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="This Week"
            value="+12"
            trend="Credits earned"
          />
        </div>

        {/* Credits Chart */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Credits Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="credits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Impact Equivalents */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Your Impact Equivalent To:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TreePine className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">63</p>
                  <p className="text-sm text-muted-foreground">Trees Planted</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,450</p>
                  <p className="text-sm text-muted-foreground">kWh Saved</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Wind className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3,200</p>
                  <p className="text-sm text-muted-foreground">Miles Not Driven</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Achievement Progress */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievement Progress
          </h3>
          <div className="space-y-4">
            {achievementsData.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{achievement.icon}</span>
                    <span className="font-medium text-foreground">{achievement.name}</span>
                    {achievement.unlocked && <span className="text-success">✓</span>}
                  </div>
                  <span className="text-muted-foreground">
                    {achievement.currentProgress}/{achievement.requirement}
                  </span>
                </div>
                <Progress 
                  value={(achievement.currentProgress / achievement.requirement) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Badge Collection */}
        <div className="mb-6">
          <BadgeCollection 
            achievements={achievementsData}
            onBadgeClick={(achievement) => {
              if (achievement.unlocked) {
                setSelectedAchievement(achievement);
                setShowAchievementModal(true);
              }
            }}
          />
        </div>

        {/* Streak Tracker */}
        <div className="mb-6">
          <StreakTracker streakData={streakData} />
        </div>

        {/* Leaderboard */}
        <div className="mb-6">
          <Leaderboard entries={leaderboardData} currentUserRank={4} />
        </div>

        {/* Regional Climate Data */}
        <div>
          <h3 className="font-semibold mb-4">Regional Climate Data</h3>
          <div className="grid gap-4">
            <Card className="p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Solar Potential</p>
                  <p className="text-xl font-bold">High</p>
                  <p className="text-xs text-success mt-1">5.8 kWh/m²/day average</p>
                </div>
                <div className="p-2 rounded-lg bg-accent/10">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Air Quality Index</p>
                  <p className="text-xl font-bold">Moderate</p>
                  <p className="text-xs text-primary mt-1">Improving with clean cookstoves</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wind className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
      />
    </div>
  );
}
