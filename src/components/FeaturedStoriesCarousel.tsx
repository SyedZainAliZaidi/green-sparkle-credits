import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Coins, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedStory {
  id: number;
  user: string;
  avatar?: string;
  location: string;
  title: string;
  description: string;
  impact: string;
  credits: number;
  beforeImage?: string;
  afterImage?: string;
}

const stories: FeaturedStory[] = [
  {
    id: 1,
    user: "Amina K.",
    location: "Nairobi, Kenya",
    title: "From Smoke to Clean Air",
    description: "Switching to a rocket stove changed my family's health. No more eye irritation or coughing.",
    impact: "85% less smoke",
    credits: 125,
  },
  {
    id: 2,
    user: "Grace M.",
    location: "Kampala, Uganda",
    title: "Saving Time & Money",
    description: "My improved charcoal stove uses 60% less fuel. That's 2 hours saved daily collecting firewood.",
    impact: "60% fuel savings",
    credits: 98,
  },
  {
    id: 3,
    user: "Fatima N.",
    location: "Dar es Salaam, Tanzania",
    title: "Empowering My Community",
    description: "Started teaching neighbors about clean cooking. We've formed a group of 15 families now.",
    impact: "15 families converted",
    credits: 210,
  },
];

export function FeaturedStoriesCarousel() {
  const [api, setApi] = useState<any>();

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Featured Stories</h3>
        <span className="text-xs text-muted-foreground">Auto-rotating</span>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent>
          {stories.map((story) => (
            <CarouselItem key={story.id}>
              <Card className="p-5 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.avatar} alt={story.user} />
                    <AvatarFallback>{story.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{story.user}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{story.location}</span>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="space-y-3">
                  <h5 className="font-bold text-lg">{story.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {story.description}
                  </p>

                  {/* Impact Badge */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                      <TrendingUp className="h-3 w-3" />
                      <span>{story.impact}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <Coins className="h-3 w-3" />
                      <span>{story.credits} credits</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </Card>
  );
}
