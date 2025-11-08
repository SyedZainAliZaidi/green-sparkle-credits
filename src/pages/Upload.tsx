import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Volume2, CheckCircle, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import { CameraCapture } from "@/components/CameraCapture";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { LoadingButton } from "@/components/LoadingButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<"upload" | "analyze" | "calculate" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();
  const { triggerLight, triggerSuccess, triggerError } = useHaptic();

  const handleCameraCapture = (imageData: string) => {
    setImage(imageData);
    setShowCamera(false);
    triggerSuccess();
    toast.success("Photo captured successfully! ✓");
  };

  const initiateVerification = () => {
    if (!image) {
      toast.error("Please capture an image first");
      triggerError();
      const button = document.getElementById("verify-button");
      button?.classList.add("animate-shake");
      setTimeout(() => button?.classList.remove("animate-shake"), 500);
      return;
    }
    triggerLight();
    setShowConfirmDialog(true);
  };

  const handleVerify = async () => {
    setShowConfirmDialog(false);
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Stage 1: Uploading image
      setUploadStage("upload");
      toast.info("Uploading image...", { id: "upload-status" });
      await simulateProgress(0, 33, 800);

      // Stage 2: AI Analysis
      setUploadStage("analyze");
      toast.info("Analyzing with AI...", { id: "upload-status" });
      await simulateProgress(33, 66, 1000);

      // Stage 3: Calculating impact
      setUploadStage("calculate");
      toast.info("Calculating impact...", { id: "upload-status" });
      await simulateProgress(66, 100, 700);

      // Success
      toast.success("Analysis complete! 💰", { id: "upload-status" });
      setTimeout(() => {
        toast.success("Credits added to your account! 💰");
        navigate("/results", { state: { image } });
      }, 500);
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
      toast.error("Upload failed. Please try again.", { id: "upload-status" });
    } finally {
      setIsUploading(false);
      setUploadStage(null);
    }
  };

  const simulateProgress = (start: number, end: number, duration: number) => {
    return new Promise((resolve) => {
      const steps = 20;
      const increment = (end - start) / steps;
      const stepDuration = duration / steps;
      let current = start;

      const interval = setInterval(() => {
        current += increment;
        setUploadProgress(Math.min(current, end));
        
        if (current >= end) {
          clearInterval(interval);
          resolve(true);
        }
      }, stepDuration);
    });
  };

  const handleRetry = () => {
    setUploadError(null);
    handleVerify();
  };

  const handleVoiceGuidance = () => {
    triggerLight();
    toast.info("🔊 Voice guidance: Take a clear photo of your cookstove from the front. Make sure the entire stove is visible.");
  };

  const getOverlayMessage = () => {
    switch (uploadStage) {
      case "upload":
        return "Uploading image...";
      case "analyze":
        return "Analyzing with AI...";
      case "calculate":
        return "Calculating impact...";
      default:
        return "Processing...";
    }
  };

  return (
    <>
      {/* Full Screen Loading Overlay */}
      <LoadingOverlay 
        isVisible={isUploading} 
        message={getOverlayMessage()}
        progress={uploadProgress}
      />

      {/* Camera Component */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

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
            aria-label="Listen to voice guidance for taking cookstove photo"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            Hear Instructions
          </Button>
        </Card>

        {/* Camera Capture */}
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {!image ? (
              <div className="flex flex-col items-center justify-center py-12">
                <button
                  onClick={() => {
                    triggerLight();
                    setShowCamera(true);
                  }}
                  className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-br from-primary to-success text-white shadow-card hover:shadow-card-hover transition-base hover:scale-105 animate-pulse-soft mb-6 group"
                  aria-label="Open camera to capture cookstove photo"
                >
                  <Camera className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <h3 className="text-lg font-semibold mb-2">Ready to Capture</h3>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                  Position your cookstove in good lighting and tap the button above
                </p>
                <p className="text-xs text-muted-foreground">Tap the glowing button to open camera 📸</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Captured clean cookstove ready for verification"
                    className="w-full h-auto"
                    loading="eager"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Image Captured
                    </div>
                  </div>
                </div>
                {/* Loading State */}
                {isUploading && (
                  <Card className="p-6 bg-muted/50 animate-fade-in">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">
                          {uploadStage === "upload" && "Uploading image..."}
                          {uploadStage === "analyze" && (
                            <span className="flex items-center gap-1">
                              Analyzing with AI
                              <span className="inline-flex gap-0.5">
                                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                              </span>
                            </span>
                          )}
                          {uploadStage === "calculate" && "Calculating impact..."}
                        </span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  </Card>
                )}

                {/* Error State */}
                {uploadError && (
                  <Card className="p-4 bg-destructive/10 border-destructive/20 animate-shake">
                    <div className="space-y-3">
                      <p className="text-sm text-destructive font-medium">{uploadError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="w-full"
                      >
                        Try Again
                      </Button>
                    </div>
                  </Card>
                )}

                <div className="flex gap-3">
                  <LoadingButton
                    variant="outline"
                    onClick={() => {
                      setImage(null);
                      setUploadError(null);
                    }}
                    className="flex-1"
                    isLoading={isUploading}
                    loadingText="Wait..."
                  >
                    Retake
                  </LoadingButton>
                  <LoadingButton
                    id="verify-button"
                    onClick={initiateVerification}
                    className="flex-1"
                    isLoading={isUploading}
                    loadingText="Processing..."
                  >
                    Verify Cookstove
                  </LoadingButton>
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to submit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your photo will be analyzed by AI to verify it's a clean cookstove and calculate your carbon credits. This usually takes a few seconds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify}>
              Yes, Submit Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
