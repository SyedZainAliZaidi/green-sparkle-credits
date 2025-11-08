import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Wallet, DollarSign, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CreditWalletCardProps {
  availableCredits: number;
  pendingCredits: number;
  earningHistory: Array<{ date: string; credits: number }>;
}

export const CreditWalletCard = ({
  availableCredits,
  pendingCredits,
  earningHistory,
}: CreditWalletCardProps) => {
  const totalCredits = availableCredits + pendingCredits;
  const estimatedValue = (availableCredits * 0.5).toFixed(2); // $0.50 per credit estimate

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Credit Wallet
            </CardTitle>
            <CardDescription>Your carbon credit balance</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <DollarSign className="h-3 w-3" />
            ${estimatedValue}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="text-4xl font-bold text-foreground">
              <AnimatedCounter end={totalCredits} suffix=" Credits" />
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Available: <span className="font-semibold text-foreground">{availableCredits}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">
                  Pending: <span className="font-semibold text-foreground">{pendingCredits}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningHistory}>
                <defs>
                  <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border rounded-lg p-2 shadow-lg">
                          <p className="text-sm font-medium">{payload[0].value} credits</p>
                          <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="credits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#creditGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Distribution</span>
            <span className="font-medium">50% to you, 50% to women</span>
          </div>
          
          <Button className="w-full" size="lg" disabled>
            <DollarSign className="mr-2 h-4 w-4" />
            Cash Out (Demo Mode)
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Estimated value: ${estimatedValue} USD
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
