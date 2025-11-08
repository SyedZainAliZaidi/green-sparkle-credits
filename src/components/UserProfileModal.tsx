import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Coins, Upload, Award } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { toast } from "sonner";

interface UserProfile {
  username: string;
  avatar?: string;
  location: string;
  totalCredits: number;
  submissions: number;
  badges: string[];
  isFollowing: boolean;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
}

export function UserProfileModal({
  open,
  onOpenChange,
  profile,
}: UserProfileModalProps) {
  const { triggerLight, triggerSuccess } = useHaptic();

  if (!profile) return null;

  const handleFollow = () => {
    triggerLight();
    if (profile.isFollowing) {
      toast.success("Unfollowed!");
    } else {
      triggerSuccess();
      toast.success("Now following!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center -mt-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar} alt={profile.username} />
            <AvatarFallback className="text-2xl">{profile.username[0]}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>

          <Button 
            variant={profile.isFollowing ? "outline" : "default"}
            className="w-full max-w-xs"
            onClick={handleFollow}
          >
            {profile.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Coins className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{profile.totalCredits}</p>
            <p className="text-xs text-muted-foreground">Credits</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{profile.submissions}</p>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-5 w-5 text-success" />
            </div>
            <p className="text-2xl font-bold">{profile.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </Card>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-semibold mb-3">Badges Earned</h3>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-lg py-1 px-3">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
