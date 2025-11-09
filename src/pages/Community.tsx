import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MapPin, Coins, Upload, X, Leaf, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { AppFooter } from "@/components/AppFooter";

interface Submission {
  id: string;
  image_url: string;
  location: string;
  cookstove_type: string;
  credits_earned: number;
  co2_prevented: number;
  likes: number;
  created_at: string;
  verified: boolean;
}

interface CommunityStats {
  totalSubmissions: number;
  totalCO2: number;
  treesEquivalent: number;
}

export default function Community() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalSubmissions: 0,
    totalCO2: 0,
    treesEquivalent: 0,
  });
  const [filterBy, setFilterBy] = useState<string>("all");
  const [likedSubmissions, setLikedSubmissions] = useState<Set<string>>(new Set());
  const { triggerLight, triggerSuccess } = useHaptic();

  useEffect(() => {
    fetchCommunityData();
  }, [filterBy]);

  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);

      // Fetch community stats
      const { data: statsData, error: statsError } = await supabase
        .from('submissions')
        .select('credits_earned, co2_prevented')
        .eq('verified', true);

      if (statsError) throw statsError;

      if (statsData) {
        const totalSubmissions = statsData.length;
        const totalCO2 = statsData.reduce((sum, s) => sum + parseFloat(s.co2_prevented.toString()), 0);
        const treesEquivalent = Math.round(totalCO2 * 15); // Pakistan Tree Tsunami reference

        setCommunityStats({
          totalSubmissions,
          totalCO2,
          treesEquivalent,
        });
      }

      // Build query based on filter
      let query = supabase
        .from('submissions')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(20);

      // Apply filters
      if (filterBy === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (filterBy === 'liked') {
        query = query.order('likes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching community data:', error);
      toast.error('Failed to load community feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    triggerLight();
    
    // Optimistic update
    setSubmissions(subs =>
      subs.map(sub => {
        if (sub.id === id) {
          const isLiked = likedSubmissions.has(id);
          return { ...sub, likes: isLiked ? sub.likes - 1 : sub.likes + 1 };
        }
        return sub;
      })
    );

    // Update liked state
    const newLiked = new Set(likedSubmissions);
    if (likedSubmissions.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
      triggerSuccess();
      toast.success("محبت! ❤️ Liked!");
    }
    setLikedSubmissions(newLiked);

    // Update in database
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    const newLikes = likedSubmissions.has(id) ? submission.likes - 1 : submission.likes + 1;

    const { error } = await supabase
      .from('submissions')
      .update({ likes: newLikes })
      .eq('id', id);

    if (error) {
      console.error('Error updating likes:', error);
      // Revert on error
      setSubmissions(subs =>
        subs.map(sub => (sub.id === id ? submission : sub))
      );
      setLikedSubmissions(likedSubmissions);
      toast.error('Failed to update like');
    }
  };

  const getTimeAgo = (timestamp: string, urdu: boolean = false) => {
    const distance = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    
    if (!urdu) return distance;
    
    // Simple Urdu translations
    return distance
      .replace('about ', '')
      .replace('less than a minute ago', 'ابھی')
      .replace(/(\d+) hours? ago/, '$1 گھنٹے پہلے')
      .replace(/(\d+) days? ago/, '$1 دن پہلے')
      .replace(/(\d+) minutes? ago/, '$1 منٹ پہلے');
  };

  const getCookstoveTypeUrdu = (type: string) => {
    const types: { [key: string]: string } = {
      'improved biomass': 'بہتر بائیو ماس',
      'rocket stove': 'راکٹ چولہ',
      'lpg': 'ایل پی جی',
      'solar cooker': 'شمسی چولہ',
      'gasifier stove': 'گیسیفائر چولہ',
    };
    return types[type.toLowerCase()] || type;
  };

  if (submissions.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-background animate-fade-in">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">🇵🇰 Pakistan Community</h1>
            <p className="text-muted-foreground">پاکستان کی برادری کا اثر دیکھیں</p>
          </div>
          <EmptyState
            icon={Upload}
            emoji="📸"
            title="Upload your first chulha photo to start!"
            description="Be the first to share your improved cookstove with the Pakistan community. Start earning credits and inspire others!"
            actionLabel="Upload Photo"
            onAction={() => navigate("/upload")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background animate-fade-in">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">🇵🇰 Pakistan Community</h1>
          <p className="text-muted-foreground">Together, Pakistan is fighting climate change!</p>
        </div>

        {isLoading ? (
          <>
            {/* Skeleton Banner */}
            <Card className="p-6 mb-6 animate-pulse">
              <div className="h-6 w-64 bg-muted rounded mb-4 mx-auto" />
              <div className="grid grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="h-8 w-16 bg-muted rounded mx-auto" />
                    <div className="h-3 w-20 bg-muted rounded mx-auto" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Skeleton Filter */}
            <div className="h-10 w-48 bg-muted rounded animate-pulse mb-6" />

            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Pakistan Community Impact Banner */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-pakistan-green via-success to-pakistan-green text-white shadow-lg">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  🇵🇰 Pakistan Community Impact
                </h2>
                <p className="text-sm opacity-90 mb-1">
                  Together, Pakistan is fighting climate change!
                </p>
                <p className="text-xs opacity-75 font-urdu">
                  مل کر، پاکستان موسمیاتی تبدیلی سے لڑ رہا ہے
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-3xl font-bold">{communityStats.totalSubmissions}</p>
                  <p className="text-xs opacity-90">Submissions</p>
                  <p className="text-[10px] opacity-75">جمع شدہ</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{communityStats.totalCO2.toFixed(1)}</p>
                  <p className="text-xs opacity-90">Tons CO₂ Saved</p>
                  <p className="text-[10px] opacity-75">ٹن بچایا</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{communityStats.treesEquivalent}</p>
                  <p className="text-xs opacity-90">Trees Planted</p>
                  <p className="text-[10px] opacity-75">درخت لگائے</p>
                </div>
              </div>
              <div className="text-center pt-3 border-t border-white/20">
                <p className="text-xs opacity-90">
                  🌍 Lahore is the world's most polluted city. 70% of rural households use biomass.
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Your improved cookstove is making a difference for 220 million Pakistanis!
                </p>
              </div>
            </Card>

            {/* Filter Dropdown */}
            <div className="mb-6">
              <Select value={filterBy} onValueChange={(value) => { setFilterBy(value); triggerLight(); }}>
                <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pakistan</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="liked">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((submission) => {
                const pkrValue = (submission.credits_earned * 0.5 * 280).toFixed(0);
                const isLiked = likedSubmissions.has(submission.id);
                
                return (
                  <Card 
                    key={submission.id}
                    className="overflow-hidden bg-white border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image 16:9 */}
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={submission.image_url} 
                        alt={`${submission.cookstove_type} in ${submission.location}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Location Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-background/90 text-foreground border-border backdrop-blur-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {submission.location || 'Pakistan'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Cookstove Type - Bilingual */}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {submission.cookstove_type}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {getCookstoveTypeUrdu(submission.cookstove_type)}
                        </p>
                      </div>

                      {/* Credits & CO2 */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-primary">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{submission.credits_earned}</span>
                          <span className="text-xs text-muted-foreground">• Rs {pkrValue}</span>
                        </div>
                        <div className="flex items-center gap-1 text-success">
                          <Leaf className="h-4 w-4" />
                          <span className="text-xs">{parseFloat(submission.co2_prevented.toString()).toFixed(1)}kg CO₂</span>
                        </div>
                      </div>

                      {/* Like Button & Time */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 gap-1 transition-all",
                            isLiked && "text-red-500 hover:text-red-600"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(submission.id);
                          }}
                        >
                          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                          <span className="text-xs">{submission.likes}</span>
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          <span>{getTimeAgo(submission.created_at)}</span>
                          <span className="mx-1">•</span>
                          <span>{getTimeAgo(submission.created_at, true)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
