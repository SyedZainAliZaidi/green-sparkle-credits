import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ttsService } from "@/utils/textToSpeech";
import { useLocation } from "react-router-dom";

export function FloatingVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();

  const getPageGuidance = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return "Welcome to EcoCredit! Upload a photo of your clean cookstove to start earning carbon credits and tracking your environmental impact.";
      case '/upload':
        return "Take a clear photo of your cookstove from the front. Make sure the entire stove is visible with good lighting. The AI will verify it and calculate your carbon credits.";
      case '/dashboard':
        return "Your dashboard shows your total credits earned, environmental impact, achievements, and community rankings. Keep submitting to earn more credits!";
      case '/community':
        return "See what others in your community are achieving. Like their submissions and follow their progress. Together we make a bigger impact!";
      case '/quiz':
        return "Test your knowledge about clean cookstoves and climate impact. Earn bonus credits for each correct answer!";
      default:
        return "Navigate through the app to track your environmental impact and earn carbon credits.";
    }
  };

  const handleVoiceClick = async () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      return;
    }

    const guidance = getPageGuidance();
    
    await ttsService.speak(guidance, {
      onStart: () => {
        setIsSpeaking(true);
        toast.info("🔊 Playing guidance...");
      },
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: (error) => {
        setIsSpeaking(false);
        toast.error("Failed to play audio");
        console.error(error);
      }
    });
  };

  return (
    <Button
      size="lg"
      onClick={handleVoiceClick}
      className={cn(
        "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
        isSpeaking && "animate-pulse bg-primary/90 scale-110"
      )}
    >
      {isSpeaking ? (
        <Volume2 className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
      
      {/* Pulsing ring animation when speaking */}
      {isSpeaking && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </Button>
  );
}
