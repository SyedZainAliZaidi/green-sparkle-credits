import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { SubmissionCard, SubmissionCardSkeleton } from "@/components/SubmissionCard";
import { SubmissionDetailModal } from "@/components/SubmissionDetailModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { RegionalImpactMap } from "@/components/RegionalImpactMap";
import { FeaturedStoriesCarousel } from "@/components/FeaturedStoriesCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MapPin, Coins, Clock, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useSwipeable } from "react-swipeable";

interface Submission {
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
  comments: Array<{
    id: number;
    user: string;
    avatar?: string;
    text: string;
    timestamp: string;
  }>;
}

interface UserProfile {
  username: string;
  avatar?: string;
  location: string;
  totalCredits: number;
  submissions: number;
  badges: string[];
  isFollowing: boolean;
}

export default function Community() {
  const navigate = useNavigate();
  const [hasSubmissions] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { triggerLight, triggerSuccess } = useHaptic();
  
  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Filter states
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      user: "Amina K.",
      location: "Nairobi, Kenya",
      cookstoveType: "Rocket Stove",
      efficiencyRating: 85,
      credits: 25,
      likes: 34,
      timestamp: "2 hours ago",
      image: "https://images.unsplash.com/photo-1580538000000-80000000?w=400&h=400&fit=crop",
      liked: false,
      co2Prevented: 12.5,
      healthBenefit: "Reduced smoke inhalation by 85%, improving respiratory health for entire family",
      comments: [
        { id: 1, user: "Sarah W.", text: "Amazing work! Keep inspiring us! 💚", timestamp: "1h ago" },
        { id: 2, user: "Grace M.", text: "This is so inspiring!", timestamp: "45m ago" },
        { id: 3, user: "Mary L.", text: "Well done! Your family must be proud 🌟", timestamp: "20m ago" },
      ],
    },
    {
      id: 2,
      user: "Grace M.",
      location: "Kampala, Uganda",
      cookstoveType: "Improved Charcoal",
      efficiencyRating: 78,
      credits: 22,
      likes: 28,
      timestamp: "5 hours ago",
      image: "https://images.unsplash.com/photo-1580538100000-80000000?w=400&h=400&fit=crop",
      liked: false,
      co2Prevented: 8.3,
      healthBenefit: "60% reduction in indoor air pollution",
      comments: [
        { id: 1, user: "Amina K.", text: "Love this! 🔥", timestamp: "2h ago" },
        { id: 2, user: "Fatima N.", text: "Great choice of stove!", timestamp: "1h ago" },
      ],
    },
    {
      id: 3,
      user: "Fatima N.",
      location: "Dar es Salaam, Tanzania",
      cookstoveType: "Gasifier Stove",
      efficiencyRating: 92,
      credits: 28,
      likes: 42,
      timestamp: "1 day ago",
      image: "https://images.unsplash.com/photo-1580538200000-80000000?w=400&h=400&fit=crop",
      liked: true,
      co2Prevented: 15.7,
      healthBenefit: "Nearly smoke-free cooking, major improvement in kitchen air quality",
      comments: [
        { id: 1, user: "Mary L.", text: "Incredible impact! 🌍", timestamp: "12h ago" },
        { id: 2, user: "Sarah W.", text: "This is the future!", timestamp: "8h ago" },
        { id: 3, user: "Esther K.", text: "Need to get one of these!", timestamp: "5h ago" },
      ],
    },
    {
      id: 4,
      user: "Sarah W.",
      location: "Kigali, Rwanda",
      cookstoveType: "Rocket Stove",
      efficiencyRating: 85,
      credits: 25,
      likes: 31,
      timestamp: "1 day ago",
      image: "https://images.unsplash.com/photo-1580538300000-80000000?w=400&h=400&fit=crop",
      liked: false,
      co2Prevented: 11.2,
      healthBenefit: "Clean cooking for family of 6",
      comments: [
        { id: 1, user: "Grace M.", text: "Beautiful work! 💪", timestamp: "8h ago" },
      ],
    },
    {
      id: 5,
      user: "Mary L.",
      location: "Nairobi, Kenya",
      cookstoveType: "Solar Cooker",
      efficiencyRating: 95,
      credits: 30,
      likes: 56,
      timestamp: "2 days ago",
      image: "https://images.unsplash.com/photo-1580538400000-80000000?w=400&h=400&fit=crop",
      liked: false,
      co2Prevented: 18.4,
      healthBenefit: "Zero emissions, completely sustainable cooking solution",
      comments: [
        { id: 1, user: "Amina K.", text: "Solar power! Love it! ☀️", timestamp: "1d ago" },
        { id: 2, user: "Fatima N.", text: "This is revolutionary!", timestamp: "18h ago" },
      ],
    },
    {
      id: 6,
      user: "Esther K.",
      location: "Mombasa, Kenya",
      cookstoveType: "Improved Charcoal",
      efficiencyRating: 75,
      credits: 22,
      likes: 25,
      timestamp: "2 days ago",
      image: "https://images.unsplash.com/photo-1580538500000-80000000?w=400&h=400&fit=crop",
      liked: false,
      co2Prevented: 7.8,
      healthBenefit: "Significant reduction in cooking time and fuel use",
      comments: [
        { id: 1, user: "Sarah W.", text: "Keep up the good work! 🌟", timestamp: "1d ago" },
      ],
    },
  ]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: number) => {
    triggerLight();
    setSubmissions(subs =>
      subs.map(sub => {
        if (sub.id === id) {
          const wasLiked = sub.liked;
          const newLiked = !sub.liked;
          
          if (newLiked) {
            triggerSuccess();
            toast.success("Liked! ❤️");
          }
          
          return { ...sub, liked: newLiked, likes: wasLiked ? sub.likes - 1 : sub.likes + 1 };
        }
        return sub;
      })
    );
  };

  const handleRefresh = async () => {
    triggerLight();
    await new Promise(resolve => setTimeout(resolve, 1000));
    triggerSuccess();
    toast.success("Feed refreshed! ✨");
  };

  const handleSubmissionClick = (submission: Submission) => {
    triggerLight();
    setSelectedSubmission(submission);
  };

  const handleUserClick = (username: string) => {
    triggerLight();
    // Mock user profile data
    setUserProfile({
      username,
      location: submissions.find(s => s.user === username)?.location || "East Africa",
      totalCredits: 342,
      submissions: 12,
      badges: ["🥇", "🔥", "🌟", "💚"],
      isFollowing: false,
    });
    setSelectedUser(username);
  };

  const handleRegionChange = (value: string) => {
    triggerLight();
    setRegionFilter(value);
    updateActiveFilters(value, sortBy);
  };

  const handleSortChange = (value: string) => {
    triggerLight();
    setSortBy(value);
    updateActiveFilters(regionFilter, value);
  };

  const updateActiveFilters = (region: string, sort: string) => {
    const filters: string[] = [];
    if (region !== "all") filters.push(region === "my-region" ? "My Region" : region === "following" ? "Following" : region);
    if (sort !== "recent") filters.push(sort === "most-liked" ? "Most Liked" : "Highest Impact");
    setActiveFilters(filters);
  };

  const removeFilter = (filter: string) => {
    triggerLight();
    if (filter === "My Region" || filter === "Following") {
      setRegionFilter("all");
    } else if (filter === "Most Liked" || filter === "Highest Impact") {
      setSortBy("recent");
    }
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);
  };

  const totalCO2 = 12.45;
  const totalUsers = 3420;

  if (!hasSubmissions) {
    return (
      <div className="min-h-screen pb-20 bg-background animate-fade-in">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Community Impact</h1>
            <p className="text-muted-foreground">See what others are achieving</p>
          </div>
          <EmptyState
            icon={Upload}
            emoji="🌱"
            title="Be the first to share!"
            description="Your community is waiting to see your clean cookstove. Upload a photo to inspire others and start earning credits."
            actionLabel="Upload Photo"
            onAction={() => navigate("/upload")}
          />
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} pullingContent="">
      <div className="min-h-screen pb-20 bg-background animate-fade-in">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Community Impact</h1>
          <p className="text-muted-foreground">See what others are achieving</p>
        </div>

        {isLoading ? (
          <>
            {/* Skeleton Collective Impact Banner */}
            <Card className="p-6 mb-6 animate-pulse">
              <div className="h-5 w-48 bg-muted rounded mb-4 mx-auto" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <div className="h-8 w-16 bg-muted rounded mx-auto" />
                  <div className="h-3 w-24 bg-muted rounded mx-auto" />
                </div>
                <div className="text-center space-y-2">
                  <div className="h-8 w-16 bg-muted rounded mx-auto" />
                  <div className="h-3 w-24 bg-muted rounded mx-auto" />
                </div>
              </div>
            </Card>

            {/* Skeleton Filter Options */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-10 w-32 bg-muted rounded animate-pulse" />
              ))}
            </div>

            {/* Skeleton Submissions Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {Array(6).fill(0).map((_, i) => (
                <SubmissionCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : (
          <>

        {/* Collective Impact Banner */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary via-primary to-success text-primary-foreground">
          <h3 className="font-semibold mb-4 text-center">Together We've Achieved</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalCO2}t</p>
              <p className="text-sm opacity-90">CO₂ Prevented</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalUsers.toLocaleString()}</p>
              <p className="text-sm opacity-90">Active Members</p>
            </div>
          </div>
        </Card>

        {/* Featured Stories Carousel */}
        <div className="mb-6">
          <FeaturedStoriesCarousel />
        </div>

        {/* Regional Impact Map */}
        <div className="mb-6">
          <RegionalImpactMap />
        </div>

        {/* Filter and Sort Options */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select value={regionFilter} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="my-region">My Region</SelectItem>
              <SelectItem value="following">Following</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="highest-impact">Highest Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => removeFilter(filter)}
              >
                {filter}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Submissions Grid - Responsive 3/2/1 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {submissions.map((submission) => {
            const swipeHandlers = useSwipeable({
              onSwipedLeft: () => handleLike(submission.id),
              trackMouse: false,
            });
            
            return (
              <div key={submission.id} {...swipeHandlers}>
                <SubmissionCard
                  id={submission.id}
                  user={submission.user}
                  avatar={submission.avatar}
                  location={submission.location}
                  cookstoveType={submission.cookstoveType}
                  credits={submission.credits}
                  co2Prevented={submission.co2Prevented}
                  likes={submission.likes}
                  liked={submission.liked}
                  timestamp={submission.timestamp}
                  image={submission.image}
                  onClick={() => handleSubmissionClick(submission)}
                  onLike={() => handleLike(submission.id)}
                  onUserClick={() => handleUserClick(submission.user)}
                />
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full sm:w-auto">
            Load More
          </Button>
        </div>
        </>
        )}
        </div>

        {/* Modals */}
        <SubmissionDetailModal
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
          submission={selectedSubmission}
          onLike={handleLike}
          onUserClick={handleUserClick}
        />

        <UserProfileModal
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          profile={userProfile}
        />
      </div>
    </PullToRefresh>
  );
}
