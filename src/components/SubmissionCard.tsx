import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Coins, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionCardProps {
  id: number;
  user: string;
  avatar?: string;
  location: string;
  cookstoveType: string;
  credits: number;
  co2Prevented: number;
  likes: number;
  liked: boolean;
  timestamp: string;
  image: string;
  onClick?: () => void;
  onLike?: (e: React.MouseEvent) => void;
  onUserClick?: (e: React.MouseEvent) => void;
}

export function SubmissionCard({
  user,
  avatar,
  location,
  cookstoveType,
  credits,
  co2Prevented,
  likes,
  liked,
  timestamp,
  image,
  onClick,
  onLike,
  onUserClick,
}: SubmissionCardProps) {
  return (
    <Card 
      className="w-full max-w-[280px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
      onClick={onClick}
    >
      {/* Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-success/20 group-hover:opacity-80 transition-opacity" />
        {image && (
          <img 
            src={image} 
            alt={`${cookstoveType} by ${user}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* User Info Row */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick?.(e);
          }}
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={avatar} alt={user} />
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
              {user.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{user}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Cookstove Type Badge */}
        <Badge 
          className="bg-success/10 text-success hover:bg-success/20 border-success/20 px-3 py-1 text-xs font-medium"
        >
          {cookstoveType}
        </Badge>

        {/* Metrics Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-accent font-semibold">
            <span className="text-base">💰</span>
            <span>{credits} credits</span>
          </div>
          <div className="flex items-center gap-1 text-success font-semibold">
            <span className="text-base">🌍</span>
            <span>{co2Prevented}t CO₂/year</span>
          </div>
        </div>

        {/* Engagement Row */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 px-3 gap-1.5 hover:bg-accent/10",
              liked && "text-destructive"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(e);
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                liked && "fill-current"
              )}
            />
            <span className="text-sm font-medium">{likes}</span>
          </Button>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <Card className="w-full max-w-[280px] overflow-hidden animate-pulse">
      {/* Image skeleton - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-muted" />

      <div className="p-4 space-y-3">
        {/* User Info skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>

        {/* Badge skeleton */}
        <div className="h-6 w-28 bg-muted rounded-full" />

        {/* Metrics skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-5 w-24 bg-muted rounded" />
        </div>

        {/* Engagement skeleton */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="h-9 w-16 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}
