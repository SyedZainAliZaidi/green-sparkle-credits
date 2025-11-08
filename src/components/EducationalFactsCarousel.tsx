import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Lightbulb, Leaf, Heart, Home, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fact {
  id: number;
  icon: React.ReactNode;
  fact: string;
  source: string;
  learnMoreUrl: string;
}

const facts: Fact[] = [
  {
    id: 1,
    icon: <Leaf className="h-8 w-8 text-success" />,
    fact: "Clean cookstoves reduce carbon emissions by up to 80% compared to traditional open fires.",
    source: "World Health Organization, 2023",
    learnMoreUrl: "https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health"
  },
  {
    id: 2,
    icon: <Heart className="h-8 w-8 text-destructive" />,
    fact: "Indoor air pollution from traditional stoves causes 3.2 million premature deaths annually.",
    source: "WHO Global Health Observatory",
    learnMoreUrl: "https://www.who.int"
  },
  {
    id: 3,
    icon: <Home className="h-8 w-8 text-primary" />,
    fact: "Improved cookstoves can save families up to 50% on fuel costs, freeing resources for education and healthcare.",
    source: "Clean Cooking Alliance, 2024",
    learnMoreUrl: "https://cleancooking.org"
  },
  {
    id: 4,
    icon: <Lightbulb className="h-8 w-8 text-accent" />,
    fact: "Every clean cookstove prevents 1-2 tons of CO₂ per year - equivalent to planting 50-100 trees!",
    source: "Gold Standard Carbon Credits",
    learnMoreUrl: "https://www.goldstandard.org"
  }
];

export function EducationalFactsCarousel() {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Did You Know?
        </h3>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {facts.map((fact) => (
            <CarouselItem key={fact.id}>
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-background">
                    {fact.icon}
                  </div>
                  
                  <p className="text-foreground leading-relaxed">
                    {fact.fact}
                  </p>
                  
                  <p className="text-xs text-muted-foreground italic">
                    Source: {fact.source}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary"
                    onClick={() => window.open(fact.learnMoreUrl, '_blank')}
                  >
                    Learn More
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
