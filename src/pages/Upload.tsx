import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Volume2, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!image) {
      toast.error("Please capture an image first");
      // Trigger shake animation on error
      const button = document.getElementById("verify-button");
      button?.classList.add("animate-shake");
      setTimeout(() => button?.classList.remove("animate-shake"), 500);
      return;
    }

    setIsUploading(true);
    
    // Simulate AI verification
    setTimeout(() => {
      setIsUploading(false);
      navigate("/results", { state: { image } });
    }, 2000);
  };

  const handleVoiceGuidance = () => {
    toast.info("🔊 Voice guidance: Take a clear photo of your cookstove from the front. Make sure the entire stove is visible.");
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Cookstove</h1>
          <p className="text-muted-foreground">
            Take a photo to earn carbon credits and track your impact
          </p>
        </div>

        {/* How It Works */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Take a clear photo of your clean cookstove</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Our AI verifies it's a clean cookstove</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Earn carbon credits instantly!</span>
                </li>
              </ol>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleVoiceGuidance}
            className="w-full gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Hear Instructions
          </Button>
        </Card>

        {/* Camera Capture */}
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {!image ? (
              <div className="flex flex-col items-center justify-center py-12">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-br from-primary to-success text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-soft mb-6 group"
                >
                  <Camera className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <h3 className="text-lg font-semibold mb-2">Ready to Capture</h3>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                  Position your cookstove in good lighting and tap the button above
                </p>
                <p className="text-xs text-muted-foreground">Tap the glowing button to take a photo 📸</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Captured cookstove"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Image Captured
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setImage(null)}
                    className="flex-1"
                  >
                    Retake
                  </Button>
                  <Button
                    id="verify-button"
                    onClick={handleVerify}
                    disabled={isUploading}
                    className="flex-1 gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Cookstove"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-3 text-sm">Tips for Best Results</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Ensure good lighting - natural daylight works best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Capture the entire cookstove in the frame</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Hold your phone steady for a clear image</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Take photo from front angle</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
