import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Leaf, Heart, Share2, Award, Car, Lightbulb, Home as HomeIcon, Volume2, VolumeX } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { EducationalFactsCarousel } from "@/components/EducationalFactsCarousel";
import { VerificationBadge } from "@/components/VerificationBadge";
import { speakText, stopSpeaking, isSpeaking, generateResultsNarration } from "@/lib/voiceService";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { image, credits, co2, transactionHash, submissionId, cookstoveType, confidenceScore, isUrdu: initialUrdu } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(false);
  const [isUrdu, setIsUrdu] = useState(initialUrdu || false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Use data from state or fallback to defaults
  const creditsEarned = credits || 25;
  const co2Prevented = co2 ? parseFloat(co2) : 0.15;
  const treesEquivalent = Math.round(creditsEarned * 0.32); // ~0.32 trees per credit
  const milesNotDriven = Math.round(co2Prevented * 2467); // CO2 to miles conversion
  const kwhSaved = Math.round(creditsEarned * 17); // ~17 kWh per credit
  const homesPowered = (kwhSaved / 877).toFixed(1); // avg home uses 877 kWh/month
  
  // Pakistan-specific conversions
  const pkrValue = (creditsEarned * 0.5 * 280).toFixed(0); // Credits to PKR (0.5 USD per credit, 280 PKR per USD)
  const usdValue = (creditsEarned * 0.5).toFixed(2);

  useEffect(() => {
    setShowConfetti(true);
    
    // Show achievement toast
    setTimeout(() => {
      toast.success("Achievement unlocked! 🏆", {
        description: "Carbon Credit Earner - Level 1",
      });
    }, 1000);
    
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleSpeakResults = async () => {
    if (isSpeaking()) {
      stopSpeaking();
      setIsPlayingVoice(false);
      return;
    }

    try {
      setIsPlayingVoice(true);
      const narration = generateResultsNarration(
        {
          cookstove_type: cookstoveType || 'improved biomass',
          credits_earned: creditsEarned,
          co2_prevented: co2Prevented,
        },
        isUrdu ? 'ur' : 'en'
      );

      const audio = await speakText({ text: narration, language: isUrdu ? 'ur' : 'en' });
      
      if (audio) {
        audio.addEventListener('ended', () => {
          setIsPlayingVoice(false);
        });
      }
    } catch (error) {
      console.error('Voice error:', error);
      toast.error(isUrdu ? "آواز کی خرابی" : "Voice error");
      setIsPlayingVoice(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background relative overflow-hidden animate-fade-in">

      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="inline-flex p-4 rounded-full bg-success/10">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUrdu(!isUrdu)}
              >
                {isUrdu ? "English" : "اردو"}
              </Button>
              <Button
                variant={isPlayingVoice ? "default" : "outline"}
                size="sm"
                onClick={handleSpeakResults}
                className={isPlayingVoice ? "animate-pulse" : ""}
              >
                {isPlayingVoice ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-1" />
                    {isUrdu ? "رکیں" : "Stop"}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-1" />
                    {isUrdu ? "سنیں" : "Listen"}
                  </>
                )}
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isUrdu ? "تصدیق کامیاب!" : "Verification Successful!"}
          </h1>
          <p className="text-muted-foreground">
            {isUrdu 
              ? "آپ کے بہتر چولہے کی تصدیق ہو گئی ہے"
              : "Your improved cookstove has been verified"
            }
          </p>
        </div>

        {/* Credits Earned with PKR Value */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary via-primary to-success text-primary-foreground text-center animate-scale-in">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">
              {isUrdu ? "حاصل شدہ کریڈٹس" : "Credits Earned"}
            </p>
            <p className="text-6xl font-bold">{creditsEarned}</p>
            <p className="text-sm opacity-90">
              {isUrdu ? "کاربن کریڈٹس" : "Carbon Credits"}
            </p>
            <div className="pt-3 mt-3 border-t border-primary-foreground/20">
              <p className="text-2xl font-bold">PKR {pkrValue}</p>
              <p className="text-xs opacity-75">≈ ${usdValue} USD</p>
            </div>
          </div>
        </Card>

        {/* Impact Equivalency Visualizations */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-success/5 to-primary/5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            {isUrdu ? "آپ کا ماحولیاتی اثر" : "Your Environmental Impact"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-background">
              <div className="inline-flex p-3 rounded-full bg-success/10 mb-2">
                <Leaf className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={treesEquivalent} />
              </p>
              <p className="text-xs text-muted-foreground">
                {isUrdu ? "درخت لگائے" : "Trees Planted"}
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-background">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={milesNotDriven} />
              </p>
              <p className="text-xs text-muted-foreground">
                {isUrdu ? "میل نہیں چلائے" : "Miles Not Driven"}
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-background">
              <div className="inline-flex p-3 rounded-full bg-accent/10 mb-2">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={kwhSaved} />
              </p>
              <p className="text-xs text-muted-foreground">
                {isUrdu ? "kWh بچایا" : "kWh Saved"}
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-background">
              <div className="inline-flex p-3 rounded-full bg-secondary/10 mb-2">
                <HomeIcon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={parseFloat(homesPowered)} decimals={1} />
              </p>
              <p className="text-xs text-muted-foreground">
                {isUrdu ? "گھر پاور کیے" : "Homes Powered"}
              </p>
            </div>
          </div>
        </Card>

        {/* Health Benefits - Pakistan Context */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">
                {isUrdu ? "صحت کے فوائد" : "Health Benefits"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>
                    {isUrdu
                      ? "گھر کے اندر 65% آلودگی میں کمی"
                      : "65% reduction in indoor air pollution"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>
                    {isUrdu
                      ? "نقصان دہ دھوئیں کی نمائش میں 90% کمی"
                      : "90% reduction in harmful smoke exposure"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>
                    {isUrdu
                      ? "آپ کے خاندان کے لیے محفوظ کھانا پکانے کا ماحول"
                      : "Safer cooking environment for your family"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>
                    {isUrdu
                      ? "50% کم ایندھن کی ضرورت - زیادہ بچت!"
                      : "50% less fuel needed - more savings!"
                    }
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Pakistan-Specific Impact */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-semibold mb-3">
            {isUrdu ? "پاکستان میں اثرات" : "Impact in Pakistan"}
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary text-lg">🌍</span>
              <span>
                {isUrdu
                  ? "لاہور دنیا کا سب سے زیادہ آلودہ شہر ہے۔ بہتر چولہا استعمال کر کے، آپ ہوا کے معیار کو بہتر بنانے میں مدد کر رہے ہیں۔"
                  : "Lahore is the world's most polluted city. By using an improved cookstove, you're helping improve air quality."
                }
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary text-lg">👨‍👩‍👧‍👦</span>
              <span>
                {isUrdu
                  ? "پاکستان میں 5 کروڑ خاندان روایتی لکڑی کے چولہے استعمال کرتے ہیں، جو گھر کے اندر اور باہر آلودگی کا سبب بنتے ہیں۔"
                  : "50 million families in Pakistan use traditional biomass stoves, contributing to both indoor and outdoor pollution."
                }
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary text-lg">💚</span>
              <span>
                {isUrdu
                  ? "آپ کا بہتر چولہا روایتی چولہوں کے مقابلے میں 50-60% کم ایندھن استعمال کرتا ہے، آپ کے خاندان کے لیے سینکڑوں روپے بچاتا ہے۔"
                  : "Your improved stove uses 50-60% less fuel than traditional stoves, saving your family hundreds of rupees."
                }
              </span>
            </p>
          </div>
        </Card>

        {/* Cookstove Info */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">
                  {isUrdu 
                    ? `تصدیق شدہ: ${cookstoveType === 'improved biomass' ? 'بہتر بایوماس' : cookstoveType === 'rocket stove' ? 'راکٹ چولہ' : 'صاف چولہ'}`
                    : `Verified: ${cookstoveType || 'Improved Cookstove'}`
                  }
                </h3>
                {transactionHash && <VerificationBadge verified={true} transactionHash={transactionHash} />}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {isUrdu
                  ? "یہ انتہائی موثر ڈیزائن ایندھن کو مکمل طور پر جلاتا ہے، اخراج کو 80% تک کم کرتا ہے"
                  : "This highly efficient design burns fuel completely, reducing emissions by up to 80%"
                }
              </p>
              {confidenceScore && (
                <p className="text-xs text-muted-foreground">
                  {isUrdu ? "اعتماد کی سکور:" : "Confidence Score:"} <span className="font-semibold text-primary">{confidenceScore}%</span>
                </p>
              )}
            </div>
          </div>
          
          {image && (
            <div className="rounded-lg overflow-hidden">
              <img src={image} alt={isUrdu ? "تصدیق شدہ صاف چولہ" : "Verified clean cookstove"} className="w-full h-auto" loading="lazy" />
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full gap-2 h-14"
          >
            {isUrdu ? "ڈیش بورڈ دیکھیں" : "View Dashboard"}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: isUrdu ? "ایکو کریڈٹ کامیابی" : "EcoCredit Achievement",
                    text: isUrdu 
                      ? `میں نے ابھی ${creditsEarned} کاربن کریڈٹس حاصل کیے صاف چولہ استعمال کر کے!`
                      : `I just earned ${creditsEarned} carbon credits by using a clean cookstove!`,
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              {isUrdu ? "شیئر کریں" : "Share"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/upload")}
            >
              {isUrdu ? "ایک اور اپ لوڈ کریں" : "Upload Another"}
            </Button>
          </div>
        </div>

        {/* Educational Facts Carousel */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <EducationalFactsCarousel isUrdu={isUrdu} />
        </div>
      </div>
    </div>
  );
}
