import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Lightbulb, Leaf, Heart, Home, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fact {
  id: number;
  icon: React.ReactNode;
  fact: string;
  factUrdu?: string;
  source: string;
  sourceUrdu?: string;
  learnMoreUrl: string;
}

const facts: Fact[] = [
  {
    id: 1,
    icon: <Leaf className="h-8 w-8 text-success" />,
    fact: "Clean cookstoves reduce carbon emissions by up to 80% compared to traditional open fires.",
    factUrdu: "صاف چولہے روایتی کھلی آگ کے مقابلے میں کاربن اخراج کو 80% تک کم کرتے ہیں۔",
    source: "World Health Organization, 2023",
    sourceUrdu: "عالمی ادارہ صحت، 2023",
    learnMoreUrl: "https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health"
  },
  {
    id: 2,
    icon: <Heart className="h-8 w-8 text-destructive" />,
    fact: "Indoor air pollution from traditional stoves causes 3.2 million premature deaths annually.",
    factUrdu: "روایتی چولہوں سے گھر کے اندر آلودگی ہر سال 32 لاکھ قبل از وقت اموات کا سبب بنتی ہے۔",
    source: "WHO Global Health Observatory",
    sourceUrdu: "WHO گلوبل ہیلتھ آبزرویٹری",
    learnMoreUrl: "https://www.who.int"
  },
  {
    id: 3,
    icon: <Home className="h-8 w-8 text-primary" />,
    fact: "In Pakistan, improved cookstoves can save families up to PKR 1,500 per month on fuel costs.",
    factUrdu: "پاکستان میں، بہتر چولہے خاندانوں کو ایندھن کے اخراجات پر ماہانہ 1,500 روپے تک بچا سکتے ہیں۔",
    source: "Clean Cooking Alliance, 2024",
    sourceUrdu: "کلین کوکنگ الائنس، 2024",
    learnMoreUrl: "https://cleancooking.org"
  },
  {
    id: 4,
    icon: <Lightbulb className="h-8 w-8 text-accent" />,
    fact: "Lahore's air quality is ranked among the worst globally. Clean cookstoves help reduce this pollution.",
    factUrdu: "لاہور کے ہوا کا معیار عالمی سطح پر سب سے خراب میں شامل ہے۔ صاف چولہے اس آلودگی کو کم کرنے میں مدد کرتے ہیں۔",
    source: "IQAir Global Air Quality Report, 2024",
    sourceUrdu: "IQAir گلوبل ایئر کوالٹی رپورٹ، 2024",
    learnMoreUrl: "https://www.iqair.com"
  },
  {
    id: 5,
    icon: <Leaf className="h-8 w-8 text-success" />,
    fact: "Every clean cookstove prevents 1-2 tons of CO₂ per year - equivalent to planting 50-100 trees!",
    factUrdu: "ہر صاف چولہ سالانہ 1-2 ٹن CO₂ روکتا ہے - 50-100 درخت لگانے کے برابر!",
    source: "Gold Standard Carbon Credits",
    sourceUrdu: "گولڈ سٹینڈرڈ کاربن کریڈٹس",
    learnMoreUrl: "https://www.goldstandard.org"
  }
];

export function EducationalFactsCarousel({ isUrdu = false }: { isUrdu?: boolean }) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          {isUrdu ? "کیا آپ جانتے ہیں؟" : "Did You Know?"}
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
                    {isUrdu && fact.factUrdu ? fact.factUrdu : fact.fact}
                  </p>
                  
                  <p className="text-xs text-muted-foreground italic">
                    {isUrdu ? "ذریعہ:" : "Source:"} {isUrdu && fact.sourceUrdu ? fact.sourceUrdu : fact.source}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary"
                    onClick={() => window.open(fact.learnMoreUrl, '_blank')}
                  >
                    {isUrdu ? "مزید جانیں" : "Learn More"}
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
