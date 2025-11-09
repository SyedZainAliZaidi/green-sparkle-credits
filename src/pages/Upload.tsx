import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Volume2, CheckCircle, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import { CameraCapture } from "@/components/CameraCapture";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { LoadingButton } from "@/components/LoadingButton";
import { supabase } from "@/integrations/supabase/client";
import { analyzeCookstove } from "@/lib/aiAnalysis";
import { speakText, generateUploadInstructions } from "@/lib/voiceService";
import { debugLog, debugApiCall, debugError } from "@/lib/debugUtils";
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
  const [isUrdu, setIsUrdu] = useState(false);
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
      if (!image) {
        throw new Error("No image to upload");
      }

      debugLog('Upload', 'Starting verification process');

      // Stage 1: Upload image to Supabase Storage
      setUploadStage("upload");
      toast.info("Uploading image...", { id: "upload-status" });
      
      // Convert base64 to blob
      const base64Response = await fetch(image);
      const blob = await base64Response.blob();
      
      debugLog('Upload', `Image size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const filename = `cookstove_${timestamp}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cookstove-images')
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) {
        debugError('Upload', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cookstove-images')
        .getPublicUrl(filename);
      
      debugApiCall('Storage', 'POST', { filename }, { publicUrl });

      await simulateProgress(0, 33, 500);

      // Stage 2: Real AI Analysis using Replicate
      setUploadStage("analyze");
      toast.info(isUrdu ? "AI آپ کے چولہے کا تجزیہ کر رہا ہے..." : "AI analyzing your chulha...", { id: "upload-status" });
      
      // Call AI analysis
      const aiResponse = await analyzeCookstove(publicUrl);
      
      debugApiCall('AI Analysis', 'POST', { publicUrl }, aiResponse);
      
      // Show warning if fallback was used
      if (aiResponse.fallback) {
        toast.warning(isUrdu ? "آف لائن تجزیہ استعمال کیا جا رہا ہے" : "Using offline analysis", { 
          id: "fallback-warning",
          duration: 3000 
        });
      }

      await simulateProgress(33, 66, 1500);

      // Stage 3: Calculate credits and save to database
      setUploadStage("calculate");
      toast.info(isUrdu ? "اثرات کا حساب لگایا جا رہا ہے..." : "Calculating impact...", { id: "upload-status" });
      
      const creditsEarned = aiResponse.credits_earned;
      const co2Prevented = aiResponse.co2_prevented;
      const transactionHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Save submission to database with AI response data
      const { data: submissionData, error: dbError } = await supabase
        .from('submissions')
        .insert({
          image_url: publicUrl,
          credits_earned: creditsEarned,
          co2_prevented: co2Prevented,
          cookstove_type: aiResponse.cookstove_type,
          verified: aiResponse.detected && aiResponse.confidence_score >= 85,
          transaction_hash: transactionHash,
          location: 'Pakistan',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        debugError('Database', dbError);
        throw new Error(`Failed to save submission: ${dbError.message}`);
      }
      
      debugLog('Database', 'Submission saved', { id: submissionData.id });

      await simulateProgress(66, 100, 500);

      // Success
      toast.success(isUrdu ? "تجزیہ مکمل! 💰" : "Analysis complete! 💰", { id: "upload-status" });
      setTimeout(() => {
        toast.success(isUrdu ? "کریڈٹس آپ کے اکاؤنٹ میں شامل! 💰" : "Credits added to your account! 💰");
        navigate("/results", { 
          state: { 
            image: publicUrl,
            credits: creditsEarned,
            co2: co2Prevented.toString(),
            transactionHash,
            submissionId: submissionData.id,
            cookstoveType: aiResponse.cookstove_type,
            confidenceScore: aiResponse.confidence_score,
            isUrdu
          } 
        });
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      debugError('Upload', error);
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setUploadError(errorMessage);
      toast.error(errorMessage, { id: "upload-status" });
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

  const handleVoiceGuidance = async () => {
    triggerLight();
    try {
      const instructions = generateUploadInstructions(isUrdu ? 'ur' : 'en');
      await speakText({ text: instructions, language: isUrdu ? 'ur' : 'en' });
    } catch (error) {
      console.error('Voice guidance error:', error);
      toast.info("🔊 " + (isUrdu 
        ? "اپنے بہتر چولہے کی صاف تصویر لیں۔ یقینی بنائیں کہ پورا چولہا دکھائی دے رہا ہو اور روشنی اچھی ہو۔"
        : "Take a clear photo of your improved cookstove. Make sure the entire stove is visible and well-lit."
      ));
    }
  };

  const getOverlayMessage = () => {
    switch (uploadStage) {
      case "upload":
        return isUrdu ? "تصویر اپ لوڈ ہو رہی ہے..." : "Uploading image...";
      case "analyze":
        return isUrdu ? "AI سے تجزیہ کیا جا رہا ہے..." : "Analyzing with AI...";
      case "calculate":
        return isUrdu ? "اثرات کا حساب لگایا جا رہا ہے..." : "Calculating impact...";
      default:
        return isUrdu ? "پروسیسنگ..." : "Processing...";
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">
              {isUrdu ? "اپنے چولہے کی تصدیق کریں" : "Verify Your Cookstove"}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsUrdu(!isUrdu);
                triggerLight();
              }}
              className="gap-2"
            >
              {isUrdu ? "English" : "اردو"}
            </Button>
          </div>
          <p className="text-muted-foreground">
            {isUrdu 
              ? "تصویر لے کر کاربن کریڈٹس حاصل کریں اور اپنے اثرات کو ٹریک کریں"
              : "Take a photo to earn carbon credits and track your impact"
            }
          </p>
        </div>

        {/* How It Works */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {isUrdu ? "یہ کیسے کام کرتا ہے" : "How It Works"}
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>
                    {isUrdu 
                      ? "اپنے بہتر چولہے کی صاف تصویر لیں"
                      : "Take a clear photo of your improved cookstove (chulha)"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>
                    {isUrdu
                      ? "ہمارا AI اس کی تصدیق کرتا ہے"
                      : "Our AI verifies it's an improved cookstove"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>
                    {isUrdu
                      ? "فوری طور پر کاربن کریڈٹس حاصل کریں!"
                      : "Earn carbon credits instantly!"
                    }
                  </span>
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
            {isUrdu ? "ہدایات سنیں" : "Hear Instructions"}
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
                <h3 className="text-lg font-semibold mb-2">
                  {isUrdu ? "تصویر لینے کے لیے تیار" : "Ready to Capture"}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                  {isUrdu
                    ? "اچھی روشنی میں اپنا چولہ رکھیں اور اوپر والے بٹن کو دبائیں"
                    : "Position your cookstove in good lighting and tap the button above"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {isUrdu ? "کیمرہ کھولنے کے لیے چمکتے بٹن کو دبائیں 📸" : "Tap the glowing button to open camera 📸"}
                </p>
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
                      {isUrdu ? "تصویر لی گئی" : "Image Captured"}
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
                          {uploadStage === "upload" && (isUrdu ? "تصویر اپ لوڈ ہو رہی ہے..." : "Uploading image...")}
                          {uploadStage === "analyze" && (
                            <span className="flex items-center gap-1">
                              {isUrdu ? "AI سے تجزیہ" : "Analyzing with AI"}
                              <span className="inline-flex gap-0.5">
                                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                              </span>
                            </span>
                          )}
                          {uploadStage === "calculate" && (isUrdu ? "اثرات کا حساب..." : "Calculating impact...")}
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
                    loadingText={isUrdu ? "انتظار کریں..." : "Wait..."}
                  >
                    {isUrdu ? "دوبارہ لیں" : "Retake"}
                  </LoadingButton>
                  <LoadingButton
                    id="verify-button"
                    onClick={initiateVerification}
                    className="flex-1"
                    isLoading={isUploading}
                    loadingText={isUrdu ? "پروسیسنگ..." : "Processing..."}
                  >
                    {isUrdu ? "چولہے کی تصدیق کریں" : "Verify Cookstove"}
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-3 text-sm">
            {isUrdu ? "بہترین نتائج کے لیے تجاویز" : "Tips for Best Results"}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {isUrdu 
                  ? "اچھی روشنی کو یقینی بنائیں - قدرتی دن کی روشنی بہترین ہے"
                  : "Ensure good lighting - natural daylight works best"
                }
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {isUrdu
                  ? "پورے چولہے کو فریم میں پکڑیں"
                  : "Capture the entire cookstove in the frame"
                }
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {isUrdu
                  ? "واضح تصویر کے لیے اپنا فون مستحکم پکڑیں"
                  : "Hold your phone steady for a clear image"
                }
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {isUrdu
                  ? "سامنے کے زاویے سے تصویر لیں"
                  : "Take photo from front angle"
                }
              </span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isUrdu ? "جمع کرانے کے لیے تیار ہیں؟" : "Ready to submit?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isUrdu
                ? "آپ کی تصویر کا AI کے ذریعے تجزیہ کیا جائے گا تاکہ یہ تصدیق ہو سکے کہ یہ ایک بہتر چولہ ہے اور آپ کے کاربن کریڈٹس کا حساب لگایا جائے۔ اس میں عام طور پر چند سیکنڈ لگتے ہیں۔"
                : "Your photo will be analyzed by AI to verify it's an improved cookstove and calculate your carbon credits. This usually takes a few seconds."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isUrdu ? "منسوخ کریں" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify}>
              {isUrdu ? "ہاں، تصویر جمع کرائیں" : "Yes, Submit Photo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
