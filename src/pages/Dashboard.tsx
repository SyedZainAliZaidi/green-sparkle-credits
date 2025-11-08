import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { AchievementModal } from "@/components/AchievementModal";
import { BadgeCollection } from "@/components/BadgeCollection";
import { StreakTracker } from "@/components/StreakTracker";
import { Leaderboard } from "@/components/Leaderboard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, Leaf, Upload, TrendingUp, Award, TreePine, Zap, Wind, Camera, Globe, Image as ImageIcon, DollarSign, Users } from "lucide-react";
import { SolarPotentialCard } from "@/components/SolarPotentialCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { ImpactMap } from "@/components/ImpactMap";
import { CreditWalletCard } from "@/components/CreditWalletCard";
import { DistributionTracker } from "@/components/DistributionTracker";
import { CreditTransactionHistory } from "@/components/CreditTransactionHistory";
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
  const totalCredits = 245;
  const dollarValue = (totalCredits * 2.5).toFixed(2);

  const chartData = [
    { date: "Nov 1", credits: 45 },
    { date: "Nov 3", credits: 78 },
    { date: "Nov 5", credits: 92 },
    { date: "Nov 7", credits: 125 },
    { date: "Nov 9", credits: 156 },
    { date: "Nov 11", credits: 189 },
    { date: "Nov 13", credits: 245 },
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

  // Mock credit transaction data
  const mockTransactions = [
    {
      id: "1",
      action: "Clean cookstove verified",
      credits_earned: 12,
      transaction_hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
      status: "confirmed" as const,
      verified: true,
      created_at: new Date(2025, 10, 7, 14, 30).toISOString(),
    },
    {
      id: "2",
      action: "Daily usage verification",
      credits_earned: 8,
      transaction_hash: "0x3c4e8b2f1d9a6c5e7f8b3c4e8b2f1d9a6c5e7f8b3c4e8b2f1d9a6c5e7f8b3c4e",
      status: "confirmed" as const,
      verified: true,
      created_at: new Date(2025, 10, 6, 10, 15).toISOString(),
    },
    {
      id: "3",
      action: "Weekly impact milestone",
      credits_earned: 15,
      transaction_hash: "0x9b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f9a8b7c6d5e4f3a2b1c9d8e7f6a5b4c",
      status: "pending" as const,
      verified: false,
      created_at: new Date(2025, 10, 5, 16, 45).toISOString(),
    },
    {
      id: "4",
      action: "First submission bonus",
      credits_earned: 20,
      transaction_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      status: "confirmed" as const,
      verified: true,
      created_at: new Date(2025, 10, 1, 9, 0).toISOString(),
    },
  ];

  // Mock earning history for wallet chart
  const earningHistory = [
    { date: "Nov 1", credits: 20 },
    { date: "Nov 2", credits: 28 },
    { date: "Nov 3", credits: 36 },
    { date: "Nov 4", credits: 44 },
    { date: "Nov 5", credits: 59 },
    { date: "Nov 6", credits: 67 },
    { date: "Nov 7", credits: 79 },
  ];

  const availableCredits = 64; // confirmed credits
  const pendingCredits = 15; // pending credits
  const userPortionCredits = 122; // 50% of total earned
  const communityPortionCredits = 123; // 50% to community
  const womenBenefited = 18;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Hero Stat Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary via-success to-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="h-6 w-6 opacity-90" />
              <p className="text-sm font-medium opacity-90">Total Credits Earned</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-6xl font-bold">
                <AnimatedCounter end={totalCredits} duration={2000} />
              </div>
              
              <div className="flex items-baseline gap-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 opacity-90" />
                  <span className="text-2xl font-semibold opacity-95">
                    <AnimatedCounter end={parseFloat(dollarValue)} duration={2000} decimals={2} />
                  </span>
                </div>
                <span className="text-sm opacity-75">USD equivalent</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/20">
              <Users className="h-4 w-4 opacity-90" />
              <p className="text-sm opacity-90 font-medium">
                50% of credits support household women
              </p>
            </div>
          </div>
        </Card>

        {/* Impact Visualization Chart */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Credit Accumulation Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickMargin={10}
                  label={{ value: 'Credits', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    padding: "8px 12px"
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="credits" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2x2 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <Globe className="h-6 w-6 text-success" />
              </div>
              <span className="text-3xl">🌍</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter end={1.2} decimals={1} suffix="t" />
            </p>
            <p className="text-sm text-muted-foreground">CO₂ Prevented</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl">📸</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter end={18} />
            </p>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter end={25} suffix="+" />
            </p>
            <p className="text-sm text-muted-foreground">This Week Credits</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10">
                <TreePine className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-3xl">🌳</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter end={63} />
            </p>
            <p className="text-sm text-muted-foreground">Trees Equivalent</p>
          </Card>
        </div>

        {/* Achievements - Horizontal Scroll */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Achievements
          </h3>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex gap-4 pb-4">
              {achievementsData.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`inline-block w-40 flex-shrink-0 p-4 cursor-pointer transition-all hover:shadow-lg ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary/10 to-success/10 border-primary/20' 
                      : 'bg-muted/30 grayscale opacity-60'
                  }`}
                  onClick={() => {
                    if (achievement.unlocked) {
                      setSelectedAchievement(achievement);
                      setShowAchievementModal(true);
                    }
                  }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className="font-semibold text-sm leading-tight text-foreground">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.unlocked ? `+${achievement.creditsReward} credits` : 'Locked'}
                    </p>
                    <div className="pt-2">
                      <Progress 
                        value={(achievement.currentProgress / achievement.requirement) * 100} 
                        className="h-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.currentProgress}/{achievement.requirement}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>


        {/* Streak Tracker */}
        <div className="mb-6">
          <StreakTracker streakData={streakData} />
        </div>

        {/* Leaderboard */}
        <div className="mb-6">
          <Leaderboard entries={leaderboardData} currentUserRank={4} />
        </div>

        {/* Carbon Credit Transparency Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Carbon Credit Transparency
          </h3>
          
          {/* Credit Wallet and Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <CreditWalletCard
              availableCredits={availableCredits}
              pendingCredits={pendingCredits}
              earningHistory={earningHistory}
            />
            <DistributionTracker
              userCredits={userPortionCredits}
              communityCredits={communityPortionCredits}
              womenBenefited={womenBenefited}
            />
          </div>

          {/* Transaction History */}
          <CreditTransactionHistory transactions={mockTransactions} />
        </div>

        {/* Climate Data Visualizations */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Real-Time Climate Data</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <SolarPotentialCard />
            <AirQualityCard />
          </div>
          <ImpactMap />
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
