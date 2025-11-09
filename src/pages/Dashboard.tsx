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
import { Coins, Leaf, Upload, TrendingUp, Award, TreePine, Zap, Wind, Camera, Globe, Image as ImageIcon, DollarSign, Users, Car, Clock } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, isAfter } from "date-fns";

interface SubmissionData {
  id: string;
  credits_earned: number;
  co2_prevented: number;
  created_at: string;
  verified: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [stats, setStats] = useState({
    totalCredits: 0,
    pkrValue: 0,
    usdValue: 0,
    totalCO2: 0,
    submissionCount: 0,
    thisWeekCredits: 0,
    treesPlanted: 0,
    milesNotDriven: 0,
    hoursCleanAir: 0,
    familiesBenefited: 0,
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all verified submissions
      const { data, error } = await supabase
        .from('submissions')
        .select('id, credits_earned, co2_prevented, created_at, verified')
        .eq('verified', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching submissions:', error);
        setHasData(false);
        return;
      }

      if (!data || data.length === 0) {
        setHasData(false);
        return;
      }

      setSubmissions(data);
      setHasData(true);

      // Calculate stats
      const totalCredits = data.reduce((sum, sub) => sum + sub.credits_earned, 0);
      const totalCO2 = data.reduce((sum, sub) => sum + parseFloat(sub.co2_prevented.toString()), 0);
      const submissionCount = data.length;
      
      // PKR conversion: credits * 0.5 USD * 280 PKR/USD
      const usdValue = totalCredits * 0.5;
      const pkrValue = Math.round(usdValue * 280);

      // This week credits (last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7);
      const thisWeekCredits = data
        .filter(sub => isAfter(new Date(sub.created_at), sevenDaysAgo))
        .reduce((sum, sub) => sum + sub.credits_earned, 0);

      // Pakistan-specific impact equivalencies
      const treesPlanted = Math.round(totalCO2 * 15); // Reference Pakistan Tree Tsunami
      const milesNotDriven = Math.round(totalCO2 * 2400); // Lahore roads
      const hoursCleanAir = Math.round(totalCO2 * 8760); // Hours per year
      const familiesBenefited = submissionCount; // 1 submission = 1 family (avg 6-8 members in Pakistan)

      setStats({
        totalCredits,
        pkrValue,
        usdValue,
        totalCO2,
        submissionCount,
        thisWeekCredits,
        treesPlanted,
        milesNotDriven,
        hoursCleanAir,
        familiesBenefited,
      });

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate achievements based on actual data
  const getAchievements = () => {
    const { totalCredits, submissionCount, totalCO2 } = stats;
    
    return [
      {
        id: "first_submission",
        name: "First Submission",
        description: "Upload your first chulha photo",
        icon: "🥉",
        unlocked: submissionCount >= 1,
        currentProgress: Math.min(submissionCount, 1),
        requirement: 1,
        creditsReward: 5,
      },
      {
        id: "community_helper",
        name: "Community Helper",
        description: "Complete 5 submissions",
        icon: "🥈",
        unlocked: submissionCount >= 5,
        currentProgress: Math.min(submissionCount, 5),
        requirement: 5,
        creditsReward: 15,
      },
      {
        id: "climate_champion",
        name: "Climate Champion",
        description: "Complete 10 submissions",
        icon: "🥇",
        unlocked: submissionCount >= 10,
        currentProgress: Math.min(submissionCount, 10),
        requirement: 10,
        creditsReward: 30,
      },
      {
        id: "hundred_credits",
        name: "100 Credits Earned",
        description: "Earn 100 carbon credits",
        icon: "💰",
        unlocked: totalCredits >= 100,
        currentProgress: Math.min(totalCredits, 100),
        requirement: 100,
        creditsReward: 20,
      },
      {
        id: "tree_planter",
        name: "Tree Planter",
        description: "Prevent 10 tons of CO2",
        icon: "🌳",
        unlocked: totalCO2 >= 10,
        currentProgress: Math.min(Math.floor(totalCO2), 10),
        requirement: 10,
        creditsReward: 25,
      },
    ];
  };

  if (!hasData && !isLoading) {
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
            title="Upload your first chulha photo to start!"
            description="Capture a photo of your improved cookstove to earn carbon credits and start tracking your environmental impact in Pakistan."
            actionLabel="Upload Photo"
            onAction={() => navigate("/upload")}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <div className="py-6 sm:py-8 max-w-screen-lg mx-auto space-y-6 sm:space-y-8 px-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-skeleton" />
            <div className="h-4 w-64 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
          </div>
          
          {/* Skeleton Hero Card */}
          <Card className="p-6 sm:p-8 shadow-card">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-muted rounded animate-skeleton" />
              <div className="h-16 w-40 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
              <div className="h-6 w-48 bg-muted rounded animate-skeleton" style={{ animationDelay: "300ms" }} />
            </div>
          </Card>

          {/* Skeleton Chart */}
          <SkeletonLoader type="chart" />

          {/* Skeleton Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
            <SkeletonLoader type="stat" />
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <SkeletonLoader type="card" />
            <SkeletonLoader type="card" />
          </div>
        </div>
      </div>
    );
  }

  // Generate chart data from submissions with cumulative credits
  const chartData = submissions.reduce((acc: { date: string; credits: number }[], submission, index) => {
    const cumulativeCredits = submissions
      .slice(0, index + 1)
      .reduce((sum, s) => sum + s.credits_earned, 0);
    
    acc.push({
      date: format(new Date(submission.created_at), 'dd/MM/yyyy'), // Pakistani date format
      credits: cumulativeCredits,
    });
    
    return acc;
  }, []);

  const achievements = getAchievements();

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
    <div className="min-h-screen bg-background w-full overflow-x-hidden pb-20">
      <div className="py-6 sm:py-8 max-w-screen-lg mx-auto space-y-6 sm:space-y-8 px-4">
        {/* Hero Stat Card - Pakistan Context */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary via-success to-primary text-primary-foreground relative overflow-hidden shadow-card">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Coins className="h-5 w-5 sm:h-6 sm:w-6 opacity-90" />
              <p className="text-sm font-medium opacity-90">Total Credits Earned</p>
            </div>
            
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="text-4xl sm:text-6xl font-bold">
                <AnimatedCounter end={stats.totalCredits} duration={2000} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold opacity-95">
                    ≈ Rs <AnimatedCounter end={stats.pkrValue} duration={2000} />
                  </span>
                  <span className="text-sm opacity-75">PKR</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 opacity-75" />
                  <span className="text-sm opacity-75">
                    ${stats.usdValue.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-white/20">
              <Users className="h-4 w-4 opacity-90 flex-shrink-0" />
              <p className="text-sm opacity-90 font-medium">
                {stats.familiesBenefited} Pakistani families benefited (avg 6-8 members)
              </p>
            </div>
          </div>
        </Card>

        {/* Impact Visualization Chart */}
        <Card className="p-4 sm:p-6 shadow-card">
          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="truncate">Cumulative Credits Over Time</span>
          </h3>
          {chartData.length > 0 ? (
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickMargin={8}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      padding: "8px 12px",
                      fontSize: "14px"
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground">
              <p>No data yet. Upload your first submission!</p>
            </div>
          )}
        </Card>

        {/* 2x2 Metric Cards Grid - Pakistan Context */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-card-hover transition-base">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-2.5 rounded-button bg-success/10">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <span className="text-2xl sm:text-3xl">🌍</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">
              <AnimatedCounter end={stats.totalCO2} decimals={1} />
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">CO₂ Prevented (kg)</p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-card-hover transition-base">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-2.5 rounded-button bg-primary/10">
                <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-2xl sm:text-3xl">📸</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">
              <AnimatedCounter end={stats.submissionCount} />
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Submissions</p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-card-hover transition-base">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-2.5 rounded-button bg-accent/10">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <span className="text-2xl sm:text-3xl">⚡</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">
              <AnimatedCounter end={stats.thisWeekCredits} />
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">This Week</p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:shadow-card-hover transition-base">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-2.5 rounded-button bg-emerald-500/10">
                <TreePine className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
              </div>
              <span className="text-2xl sm:text-3xl">🌳</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">
              <AnimatedCounter end={stats.treesPlanted} />
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Trees (Tree Tsunami)</p>
          </Card>
        </div>

        {/* Pakistan-Specific Impact Equivalencies */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Your Impact in Pakistan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter end={stats.milesNotDriven} />
                </p>
                <p className="text-xs text-muted-foreground">Miles not driven on Lahore roads</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter end={stats.hoursCleanAir} />
                </p>
                <p className="text-xs text-muted-foreground">Hours of clean air provided</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter end={stats.familiesBenefited} />
                </p>
                <p className="text-xs text-muted-foreground">Pakistani families benefited</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements - Horizontal Scroll */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Award className="h-5 w-5 text-primary flex-shrink-0" />
            Your Achievements
          </h3>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-card">
            <div className="flex gap-3 sm:gap-4 pb-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`inline-block w-36 sm:w-40 flex-shrink-0 p-3 sm:p-4 cursor-pointer transition-base hover:shadow-card-hover min-h-[48px] ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary/10 to-success/10 border-primary/20' 
                      : 'bg-muted/30 grayscale opacity-60'
                  }`}
                  onClick={() => {
                    if (achievement.unlocked) {
                      setSelectedAchievement(achievement as Achievement);
                      setShowAchievementModal(true);
                    }
                  }}
                >
                  <div className="text-center space-y-1.5 sm:space-y-2">
                    <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{achievement.icon}</div>
                    <p className="font-semibold text-xs sm:text-sm leading-tight text-foreground">
                      {achievement.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      {achievement.unlocked ? `+${achievement.creditsReward} credits` : 'Locked'}
                    </p>
                    <div className="pt-1.5 sm:pt-2">
                      <Progress 
                        value={(achievement.currentProgress / achievement.requirement) * 100} 
                        className="h-1.5"
                      />
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
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
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-base">
            <Coins className="h-5 w-5 text-primary flex-shrink-0" />
            Carbon Credit Transparency
          </h3>
          
          {/* Credit Wallet and Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
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
