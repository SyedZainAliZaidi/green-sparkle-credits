import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types/achievements";
import { Trophy, TrendingUp, Award, Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

export const Leaderboard = ({ entries, currentUserRank }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-semibold text-muted-foreground w-5 text-center">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Top Contributors
      </h3>

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.isCurrentUser;
          const rankBadge = getRankBadge(entry.rank);

          return (
            <div
              key={entry.userId}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${isCurrentUser
                  ? "bg-primary/10 border-2 border-primary/50 shadow-md"
                  : entry.rank <= 3
                  ? "bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10"
                  : "bg-muted/30 hover:bg-muted/50"
                }
              `}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {entry.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Username and Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {entry.username}
                    {isCurrentUser && " (You)"}
                  </p>
                  {rankBadge && <span className="text-lg">{rankBadge}</span>}
                </div>
              </div>

              {/* Credits */}
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">{entry.credits}</p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Rank (if not in top 10) */}
      {currentUserRank && currentUserRank > 10 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Your Rank</span>
            </div>
            <span className="text-lg font-bold text-primary">#{currentUserRank}</span>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Keep earning to climb the leaderboard! 🚀
          </p>
        </div>
      )}
    </Card>
  );
};
