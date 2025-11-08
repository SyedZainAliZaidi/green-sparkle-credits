import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/types/achievements";
import confetti from "canvas-confetti";
import { useHaptic } from "@/hooks/useHaptic";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementModal = ({ achievement, isOpen, onClose }: AchievementModalProps) => {
  const { triggerSuccess } = useHaptic();
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (isOpen && achievement) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isOpen, achievement]);

  const handleClaim = () => {
    triggerSuccess();
    setClaimed(true);
    
    toast({
      title: "Reward Claimed!",
      description: `${achievement?.creditsReward} credits added to your account`,
    });

    setTimeout(() => {
      onClose();
      setClaimed(false);
    }, 1000);
  };

  if (!achievement) return null;

  const tierColors = {
    bronze: "from-amber-600/20 to-amber-800/10 border-amber-600/50",
    silver: "from-gray-400/20 to-gray-600/10 border-gray-400/50",
    gold: "from-yellow-500/20 to-yellow-700/10 border-yellow-500/50",
    diamond: "from-blue-400/20 to-purple-500/10 border-blue-400/50",
  };

  const tierGlow = {
    bronze: "shadow-[0_0_30px_rgba(217,119,6,0.3)]",
    silver: "shadow-[0_0_30px_rgba(156,163,175,0.3)]",
    gold: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    diamond: "shadow-[0_0_30px_rgba(96,165,250,0.3)]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-2">
        <div className={`relative bg-gradient-to-br ${tierColors[achievement.tier]} ${tierGlow[achievement.tier]} p-8 text-center animate-scale-in`}>
          {/* Sparkle decorations */}
          <div className="absolute top-4 left-4 animate-pulse">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute top-4 right-4 animate-pulse" style={{ animationDelay: "0.3s" }}>
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          
          {/* Achievement Icon */}
          <div className="text-8xl mb-4 animate-bounce">
            {achievement.icon}
          </div>

          {/* Achievement Title */}
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Achievement Unlocked!
          </h2>
          
          {/* Achievement Name */}
          <div className="mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
              {achievement.tier.toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {achievement.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6">
            {achievement.description}
          </p>

          {/* Credits Reward */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-border">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">💰</span>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Credits Earned</p>
                <p className="text-2xl font-bold text-primary">
                  +{achievement.creditsReward}
                </p>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={claimed}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {claimed ? "✓ Claimed!" : "Claim Reward"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
