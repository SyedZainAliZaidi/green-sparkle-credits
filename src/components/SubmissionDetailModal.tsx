import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Coins, Share2, Flame, Wind, LeafyGreen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";

interface Comment {
  id: number;
  user: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

interface SubmissionDetail {
  id: number;
  user: string;
  avatar?: string;
  location: string;
  cookstoveType: string;
  efficiencyRating: number;
  credits: number;
  likes: number;
  timestamp: string;
  image: string;
  liked: boolean;
  co2Prevented: number;
  healthBenefit: string;
  comments: Comment[];
}

interface SubmissionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: SubmissionDetail | null;
  onLike: (id: number) => void;
  onUserClick: (username: string) => void;
}

export function SubmissionDetailModal({
  open,
  onOpenChange,
  submission,
  onLike,
  onUserClick,
}: SubmissionDetailModalProps) {
  const { triggerLight, triggerSuccess } = useHaptic();

  if (!submission) return null;

  const handleShare = () => {
    triggerLight();
    if (navigator.share) {
      navigator.share({
        title: `${submission.user}'s Clean Cookstove`,
        text: `Check out this ${submission.cookstoveType} saving ${submission.co2Prevented}kg CO₂!`,
        url: window.location.href,
      }).catch(() => {
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
    triggerSuccess();
  };

  const handleLike = () => {
    onLike(submission.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Submission Details</DialogTitle>
        </DialogHeader>

        {/* Full Image */}
        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-success/20 overflow-hidden -mt-6">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-sm">Image: {submission.cookstoveType}</span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onUserClick(submission.user)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={submission.avatar} alt={submission.user} />
              <AvatarFallback>{submission.user[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">{submission.user}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{submission.location}</span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11",
                submission.liked && "text-destructive"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-5 w-5", submission.liked && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">{submission.likes} likes</span>
          <span className="text-muted-foreground">{submission.timestamp}</span>
        </div>

        <Separator />

        {/* Cookstove Details */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            Cookstove Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="font-medium">{submission.cookstoveType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
              <p className="font-medium">{submission.efficiencyRating}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Credits Earned</p>
              <div className="flex items-center gap-1 font-medium text-accent">
                <Coins className="h-4 w-4" />
                <span>{submission.credits}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Impact Metrics */}
        <Card className="p-4 bg-gradient-to-br from-success/10 to-primary/10">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <LeafyGreen className="h-4 w-4 text-success" />
            Environmental Impact
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-primary" />
                <span className="text-sm">CO₂ Prevented</span>
              </div>
              <span className="font-semibold text-success">{submission.co2Prevented}kg</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Health Benefits</p>
              <p className="text-sm">{submission.healthBenefit}</p>
            </div>
          </div>
        </Card>

        <Separator />

        {/* Comments */}
        <div>
          <h4 className="font-semibold mb-3">Community Support</h4>
          <div className="space-y-3">
            {submission.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} alt={comment.user} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
