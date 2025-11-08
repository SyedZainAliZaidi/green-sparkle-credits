import { Card } from "@/components/ui/card";
import { Achievement, AchievementTier } from "@/types/achievements";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeCollectionProps {
  achievements: Achievement[];
  onBadgeClick?: (achievement: Achievement) => void;
}

export const BadgeCollection = ({ achievements, onBadgeClick }: BadgeCollectionProps) => {
  const tierColors: Record<AchievementTier, string> = {
    bronze: "from-amber-600 to-amber-800",
    silver: "from-gray-400 to-gray-600",
    gold: "from-yellow-500 to-yellow-700",
    diamond: "from-blue-400 to-purple-500",
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Badge Collection
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        <TooltipProvider>
          {achievements.map((achievement) => (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onBadgeClick?.(achievement)}
                  className={`
                    relative aspect-square rounded-xl p-4 transition-all duration-300
                    ${achievement.unlocked
                      ? `bg-gradient-to-br ${tierColors[achievement.tier]} hover:scale-110 hover:shadow-lg cursor-pointer`
                      : "bg-muted/50 grayscale opacity-40 hover:opacity-60"
                    }
                  `}
                >
                  {/* Badge Icon */}
                  <div className="text-4xl flex items-center justify-center h-full">
                    {achievement.unlocked ? (
                      achievement.icon
                    ) : (
                      <>
                        <span className="absolute opacity-20 text-3xl">{achievement.icon}</span>
                        <Lock className="h-6 w-6 text-muted-foreground relative z-10" />
                      </>
                    )}
                  </div>

                  {/* Shine effect for unlocked badges */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}
                </button>
              </TooltipTrigger>
              
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-primary font-medium mt-2">
                      Progress: {achievement.currentProgress}/{achievement.requirement}
                    </p>
                  )}
                  <p className="text-xs text-accent font-medium">
                    Reward: {achievement.creditsReward} credits
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Unlocked</span>
          <span className="font-semibold text-foreground">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </span>
        </div>
      </div>
    </Card>
  );
};
