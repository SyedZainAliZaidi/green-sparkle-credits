import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Coins, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: number;
  user: string;
  location: string;
  cookstoveType: string;
  credits: number;
  likes: number;
  timestamp: string;
  image: string;
  liked: boolean;
}

export default function Community() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      user: "Amina K.",
      location: "Nairobi, Kenya",
      cookstoveType: "Rocket Stove",
      credits: 25,
      likes: 34,
      timestamp: "2 hours ago",
      image: "https://images.unsplash.com/photo-1580538000000-80000000?w=400&h=400&fit=crop",
      liked: false,
    },
    {
      id: 2,
      user: "Grace M.",
      location: "Kampala, Uganda",
      cookstoveType: "Improved Charcoal",
      credits: 22,
      likes: 28,
      timestamp: "5 hours ago",
      image: "https://images.unsplash.com/photo-1580538100000-80000000?w=400&h=400&fit=crop",
      liked: false,
    },
    {
      id: 3,
      user: "Fatima N.",
      location: "Dar es Salaam, Tanzania",
      cookstoveType: "Gasifier Stove",
      credits: 28,
      likes: 42,
      timestamp: "1 day ago",
      image: "https://images.unsplash.com/photo-1580538200000-80000000?w=400&h=400&fit=crop",
      liked: true,
    },
    {
      id: 4,
      user: "Sarah W.",
      location: "Kigali, Rwanda",
      cookstoveType: "Rocket Stove",
      credits: 25,
      likes: 31,
      timestamp: "1 day ago",
      image: "https://images.unsplash.com/photo-1580538300000-80000000?w=400&h=400&fit=crop",
      liked: false,
    },
    {
      id: 5,
      user: "Mary L.",
      location: "Nairobi, Kenya",
      cookstoveType: "Solar Cooker",
      credits: 30,
      likes: 56,
      timestamp: "2 days ago",
      image: "https://images.unsplash.com/photo-1580538400000-80000000?w=400&h=400&fit=crop",
      liked: false,
    },
    {
      id: 6,
      user: "Esther K.",
      location: "Mombasa, Kenya",
      cookstoveType: "Improved Charcoal",
      credits: 22,
      likes: 25,
      timestamp: "2 days ago",
      image: "https://images.unsplash.com/photo-1580538500000-80000000?w=400&h=400&fit=crop",
      liked: false,
    },
  ]);

  const handleLike = (id: number) => {
    setSubmissions(subs =>
      subs.map(sub =>
        sub.id === id
          ? { ...sub, liked: !sub.liked, likes: sub.liked ? sub.likes - 1 : sub.likes + 1 }
          : sub
      )
    );
  };

  const totalCO2 = 12.45;
  const totalUsers = 3420;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Community Impact</h1>
          <p className="text-muted-foreground">See what others are achieving</p>
        </div>

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

        {/* Filter Options */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button variant="default" size="sm">All</Button>
          <Button variant="outline" size="sm">This Week</Button>
          <Button variant="outline" size="sm">This Month</Button>
          <Button variant="outline" size="sm">My Region</Button>
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-success/20" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{submission.user}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{submission.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 gap-1",
                        submission.liked && "text-destructive"
                      )}
                      onClick={() => handleLike(submission.id)}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          submission.liked && "fill-current"
                        )}
                      />
                      <span className="text-xs">{submission.likes}</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {submission.cookstoveType}
                    </span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-accent" />
                      <span className="font-medium text-accent">{submission.credits}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{submission.timestamp}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full sm:w-auto">
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}
