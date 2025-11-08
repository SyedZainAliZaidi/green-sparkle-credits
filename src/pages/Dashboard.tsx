import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Coins, Leaf, Upload, TrendingUp, Award, TreePine, Zap, Wind, Camera } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasData] = useState(true); // Set to false to see empty state
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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

  const achievements = [
    { name: "Bronze Member", icon: Award, color: "text-amber-600", achieved: true },
    { name: "Silver Member", icon: Award, color: "text-gray-400", achieved: true },
    { name: "Gold Member", icon: Award, color: "text-yellow-500", achieved: true },
    { name: "Platinum", icon: Award, color: "text-blue-400", achieved: false },
  ];

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

        {/* Achievements */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.achieved
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-muted/20 opacity-50"
                }`}
              >
                <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${achievement.color}`} />
                <p className="text-xs text-center font-medium">{achievement.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Earn 300 credits to unlock Platinum status!
          </p>
        </Card>

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
    </div>
  );
}
