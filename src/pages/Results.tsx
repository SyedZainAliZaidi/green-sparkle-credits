import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Leaf, Heart, Share2, TrendingUp, Award } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const image = location.state?.image;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    
    // Show achievement toast
    setTimeout(() => {
      toast.success("Achievement unlocked! 🏆", {
        description: "Carbon Credit Earner - Level 1",
      });
    }, 1000);
    
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const creditsEarned = 25;
  const co2Prevented = 0.15; // tons
  const treesEquivalent = 8;

  return (
    <div className="min-h-screen pb-20 bg-background relative overflow-hidden animate-fade-in">

      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verification Successful!
          </h1>
          <p className="text-muted-foreground">
            Your clean cookstove has been verified
          </p>
        </div>

        {/* Credits Earned */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary via-primary to-success text-primary-foreground text-center animate-scale-in">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">Credits Earned</p>
            <p className="text-6xl font-bold">{creditsEarned}</p>
            <p className="text-sm opacity-90">Carbon Credits</p>
          </div>
        </Card>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Leaf className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Prevented</p>
                <p className="text-xl font-bold">{co2Prevented}t</p>
                <p className="text-xs text-success">This month</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trees Saved</p>
                <p className="text-xl font-bold">{treesEquivalent}</p>
                <p className="text-xs text-primary">Equivalent</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Health Benefits */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Health Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>90% reduction in harmful smoke exposure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Safer cooking environment for your family</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>50% less fuel needed - more savings!</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Cookstove Info */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Verified: Rocket Stove</h3>
              <p className="text-sm text-muted-foreground">
                This highly efficient design burns wood completely, reducing emissions by up to 80%
              </p>
            </div>
          </div>
          
          {image && (
            <div className="rounded-lg overflow-hidden">
              <img src={image} alt="Verified cookstove" className="w-full h-auto" />
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full gap-2 h-14"
          >
            View Dashboard
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: "EcoCredit Achievement",
                    text: `I just earned ${creditsEarned} carbon credits by using a clean cookstove!`,
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
          </div>
        </div>

        {/* Fun Fact */}
        <Card className="p-4 mt-6 bg-muted/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-sm">
            <span className="font-semibold text-primary">Did you know?</span>{" "}
            <span className="text-muted-foreground">
              Clean cookstoves reduce cooking time by 30%, giving you more time for other activities!
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}
