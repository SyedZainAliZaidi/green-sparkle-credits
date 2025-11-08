import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Copy, Download, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface Transaction {
  id: string;
  action: string;
  credits_earned: number;
  transaction_hash: string;
  status: "pending" | "confirmed";
  verified: boolean;
  created_at: string;
}

interface CreditTransactionHistoryProps {
  transactions: Transaction[];
}

export const CreditTransactionHistory = ({ transactions }: CreditTransactionHistoryProps) => {
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month">("all");

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Transaction hash copied to clipboard");
  };

  const handleExportCSV = () => {
    const csv = [
      ["Date", "Action", "Credits", "Transaction Hash", "Status"],
      ...transactions.map((t) => [
        format(new Date(t.created_at), "yyyy-MM-dd HH:mm:ss"),
        t.action,
        t.credits_earned.toString(),
        t.transaction_hash,
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credit-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter((t) => {
      const date = new Date(t.created_at);
      if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      }
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>Track your carbon credit earnings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={dateFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("all")}
          >
            All Time
          </Button>
          <Button
            variant={dateFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("week")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={dateFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("month")}
          >
            Last 30 Days
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found for this period
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                      <Badge
                        variant={transaction.status === "confirmed" ? "default" : "secondary"}
                      >
                        {transaction.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>

                    <div className="font-medium">{transaction.action}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Transaction:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {transaction.transaction_hash.slice(0, 8)}...
                          {transaction.transaction_hash.slice(-6)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyHash(transaction.transaction_hash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-lg font-bold text-primary">
                        +{transaction.credits_earned} Credits
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
