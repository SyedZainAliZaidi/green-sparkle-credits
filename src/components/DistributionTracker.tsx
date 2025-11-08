import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, Heart } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatedCounter } from "./AnimatedCounter";

interface DistributionTrackerProps {
  userCredits: number;
  communityCredits: number;
  womenBenefited: number;
}

export const DistributionTracker = ({
  userCredits,
  communityCredits,
  womenBenefited,
}: DistributionTrackerProps) => {
  const distributionData = [
    { name: "Your Portion", value: userCredits, color: "hsl(var(--primary))" },
    { name: "Community Fund", value: communityCredits, color: "hsl(var(--secondary))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Credit Distribution
        </CardTitle>
        <CardDescription>How your credits support the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border rounded-lg p-2 shadow-lg">
                          <p className="text-sm font-medium">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">
                            {payload[0].value} credits ({((payload[0].value as number) / (userCredits + communityCredits) * 100).toFixed(0)}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-2xl font-bold">
                <AnimatedCounter end={userCredits + communityCredits} />
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
              <span className="text-sm text-muted-foreground">Your Portion</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={userCredits} />
            </div>
            <div className="text-xs text-muted-foreground">
              {((userCredits / (userCredits + communityCredits)) * 100).toFixed(0)}% of total
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--secondary))" }} />
              <span className="text-sm text-muted-foreground">Community Fund</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={communityCredits} />
            </div>
            <div className="text-xs text-muted-foreground">
              {((communityCredits / (userCredits + communityCredits)) * 100).toFixed(0)}% of total
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-secondary-foreground">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold">Women Empowerment Impact</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            <AnimatedCounter end={womenBenefited} />
          </div>
          <p className="text-sm text-muted-foreground">
            women have received credits from community fund
          </p>
        </div>

        <div className="bg-accent/50 rounded-lg p-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Impact Statement:</strong> Your contributions help
            provide clean cooking solutions to households, reducing indoor air pollution and
            empowering women with economic opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
