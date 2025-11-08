import { Card } from "@/components/ui/card";
import { StreakData } from "@/types/achievements";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface StreakTrackerProps {
  streakData: StreakData;
}

export const StreakTracker = ({ streakData }: StreakTrackerProps) => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isSubmissionDay = (date: Date) => {
    return streakData.submissionDays.some(submissionDate => 
      isSameDay(new Date(submissionDate), date)
    );
  };

  const getMotivationMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your streak today! 💪";
    } else if (streakData.currentStreak < 3) {
      return "Keep it up! You're building momentum! 🚀";
    } else if (streakData.currentStreak < 7) {
      return "Amazing consistency! Keep going! ⭐";
    } else if (streakData.currentStreak < 14) {
      return "You're on fire! Don't break the chain! 🔥";
    } else {
      return "Incredible dedication! You're unstoppable! 👑";
    }
  };

  // Get day of week for first day to offset calendar
  const firstDayOfMonth = monthStart.getDay();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Submission Streak
        </h3>
        
        {/* Streak Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-primary">{streakData.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-accent">{streakData.longestStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>

        {/* Motivation Message */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-center font-medium text-foreground">
            {getMotivationMessage()}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          {format(currentDate, "MMMM yyyy")}
        </p>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-xs text-center text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Actual days */}
          {daysInMonth.map((day) => {
            const isSubmitted = isSubmissionDay(day);
            const isToday = isSameDay(day, currentDate);
            const isPast = day < currentDate;

            return (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isSubmitted
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105"
                    : isPast
                    ? "bg-muted/30 text-muted-foreground"
                    : "bg-muted/50 text-muted-foreground"
                  }
                  ${isToday && !isSubmitted ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                `}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Submitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary bg-background" />
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </Card>
  );
};
