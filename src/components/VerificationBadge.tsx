import { CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

interface VerificationBadgeProps {
  verified: boolean;
  transactionHash?: string;
  className?: string;
}

export const VerificationBadge = ({
  verified,
  transactionHash,
  className,
}: VerificationBadgeProps) => {
  if (!verified) return null;

  const handleViewOnExplorer = () => {
    // Mock explorer link for demo
    window.open(`https://explorer.example.com/tx/${transactionHash}`, "_blank");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 ${className}`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Blockchain Verified
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm space-y-2">
          <p className="font-semibold">Blockchain Verified</p>
          <p className="text-xs text-muted-foreground">
            This submission is permanently recorded on the blockchain, ensuring transparency and
            preventing fraud.
          </p>
          {transactionHash && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleViewOnExplorer}
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              View on Explorer
            </Button>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
