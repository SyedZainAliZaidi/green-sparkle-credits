import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Users, TrendingUp, Camera, Award, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { useHaptic } from "@/hooks/useHaptic";

export default function Home() {
  const navigate = useNavigate();
  const { triggerLight } = useHaptic();

  const recentSubmissions = Array(6).fill(null).map((_, i) => ({
    id: i,
    user: `User ${i + 1}`,
    location: ["Kenya", "Uganda", "Tanzania"][i % 3],
    image: `https://images.unsplash.com/photo-${1580538-i}0000-80000000?w=400&h=300&fit=crop`,
    credits: Math.floor(Math.random() * 50) + 10,
  }));

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-success text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi02LjY4NiA2LTZ2NmMwIDMuMzE0IDIuNjg2IDYgNiA2aDZ2Nmg2djZoLTZ2Nmg2djZoLTZ2NmMtMy4zMTQgMC02LTIuNjg2LTYtNnMtMi42ODYtNi02LTZ2LTZoLTZ2LTZoNnYtNmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative px-4 py-12 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            EcoCredit Platform
          </h1>
          <p className="text-center text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Earn carbon credits by using clean cookstoves. Make a difference for your family and the planet.
          </p>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <Card className="p-4 bg-background/10 backdrop-blur-sm border-primary-foreground/20">
              <div className="text-center">
                <p className="text-3xl font-bold">12,450</p>
                <p className="text-sm text-primary-foreground/80">Tons CO₂ Prevented</p>
              </div>
            </Card>
            <Card className="p-4 bg-background/10 backdrop-blur-sm border-primary-foreground/20">
              <div className="text-center">
                <p className="text-3xl font-bold">3,420</p>
                <p className="text-sm text-primary-foreground/80">Active Users</p>
              </div>
            </Card>
          </div>

          <Button
            size="lg"
            onClick={() => {
              triggerLight();
              navigate("/upload");
            }}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-background text-primary hover:bg-background/90 shadow-lg min-h-[56px] text-lg"
          >
            <Camera className="h-5 w-5" />
            Start Verification
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-8 max-w-screen-lg mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            label="Your Credits"
            value="245"
            trend="+12 this week"
            gradient="green"
          />
          <StatCard
            icon={Leaf}
            label="CO₂ Saved"
            value="1.2t"
            trend="15 trees equivalent"
            gradient="blue"
          />
          <StatCard
            icon={Award}
            label="Your Rank"
            value="#42"
            trend="Gold Member"
            gradient="purple"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* Recent Submissions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Verifications</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/community")}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {recentSubmissions.map((submission) => (
              <Card key={submission.id} onClick={triggerLight} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-square bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">{submission.user}</p>
                    <p className="text-white/80 text-xs">{submission.location}</p>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Credits</span>
                    <span className="text-sm font-bold text-primary">{submission.credits}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Educational Cards */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Learn More</h2>
          <div className="grid gap-4">
            <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => {
              triggerLight();
              navigate("/quiz");
            }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Climate Education Quiz</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Test your knowledge and earn bonus credits
                  </p>
                  <Button size="sm" variant="outline">
                    Start Quiz
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">How Clean Cookstoves Work</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about the technology that reduces smoke and saves fuel
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Community Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    See how our community is making a difference together
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
