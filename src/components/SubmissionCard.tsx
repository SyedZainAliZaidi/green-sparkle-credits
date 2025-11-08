import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Coins, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipeable } from "react-swipeable";
import { VerificationBadge } from "./VerificationBadge";

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
  verified?: boolean;
  transactionHash?: string;
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
  verified = false,
  transactionHash,
  onClick,
  onLike,
  onUserClick,
}: SubmissionCardProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      e.event.stopPropagation();
      onLike?.(e.event as any);
    },
    trackMouse: false,
  });

  return (
    <Card 
      {...swipeHandlers}
      className="w-full max-w-[280px] overflow-hidden cursor-pointer transition-base hover:-translate-y-1 hover:shadow-card-hover group"
      onClick={onClick}
      role="article"
      aria-label={`${cookstoveType} submission by ${user} from ${location}`}
    >
      {/* Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-success/20 group-hover:opacity-80 transition-opacity" />
        {image && (
          <img 
            src={image} 
            alt={`${cookstoveType} clean cookstove by ${user} in ${location}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {/* Verification Badge Overlay */}
        {verified && (
          <div className="absolute top-2 right-2">
            <VerificationBadge verified={verified} transactionHash={transactionHash} />
          </div>
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
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onUserClick?.(e as any);
            }
          }}
          aria-label={`View ${user}'s profile`}
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={avatar} alt={`${user}'s profile picture`} />
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary" aria-label={`${user}'s initial`}>
              {user.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{user}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Cookstove Type Badge */}
        <Badge 
          className="bg-success/10 text-success hover:bg-success/20 border-success/20 px-3 py-1 text-xs font-medium"
          aria-label={`Cookstove type: ${cookstoveType}`}
        >
          {cookstoveType}
        </Badge>

        {/* Metrics Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-accent font-semibold" aria-label={`${credits} carbon credits earned`}>
            <span className="text-base" aria-hidden="true">💰</span>
            <span>{credits} credits</span>
          </div>
          <div className="flex items-center gap-1 text-success font-semibold" aria-label={`${co2Prevented} tons of CO₂ prevented per year`}>
            <span className="text-base" aria-hidden="true">🌍</span>
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
            aria-label={liked ? `Unlike. Currently ${likes} likes` : `Like. Currently ${likes} likes`}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                liked && "fill-current"
              )}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">{likes}</span>
          </Button>

          <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Posted ${timestamp}`}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <Card className="w-full max-w-[280px] overflow-hidden" role="article" aria-busy="true" aria-label="Loading submission">
      {/* Image skeleton - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-muted animate-skeleton" />

      <div className="p-4 space-y-3">
        {/* User Info skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted animate-skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
            <div className="h-3 w-32 bg-muted rounded animate-skeleton" style={{ animationDelay: "300ms" }} />
          </div>
        </div>

        {/* Badge skeleton */}
        <div className="h-6 w-28 bg-muted rounded-full animate-skeleton" style={{ animationDelay: "450ms" }} />

        {/* Metrics skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-muted rounded animate-skeleton" style={{ animationDelay: "600ms" }} />
          <div className="h-5 w-24 bg-muted rounded animate-skeleton" style={{ animationDelay: "750ms" }} />
        </div>

        {/* Engagement skeleton */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="h-9 w-16 bg-muted rounded animate-skeleton" style={{ animationDelay: "900ms" }} />
          <div className="h-4 w-20 bg-muted rounded animate-skeleton" style={{ animationDelay: "1050ms" }} />
        </div>
      </div>
    </Card>
  );
}
