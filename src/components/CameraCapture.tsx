import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Grid3x3, Image as ImageIcon, Zap, ZapOff, RotateCw, ZoomIn, ZoomOut, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { toast } from "sonner";

interface CameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const haptic = useHaptic();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (countdown !== null) return;
    
    haptic.triggerMedium();
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      haptic.triggerLight();
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply flash effect
    if (flashEnabled) {
      const flashOverlay = document.createElement("div");
      flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(flashOverlay);
      setTimeout(() => document.body.removeChild(flashOverlay), 100);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg", 0.95);
    
    setCapturedImage(imageData);
    stopCamera();
    haptic.triggerSuccess();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setRotation(0);
    setZoom(1);
    haptic.triggerLight();
    startCamera();
  };

  const handleUsePhoto = () => {
    if (!capturedImage) return;
    
    if (rotation !== 0 || zoom !== 1) {
      // Apply transformations
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const img = new Image();
      img.onload = () => {
        const size = Math.max(canvas.width, canvas.height);
        canvas.width = size;
        canvas.height = size;
        
        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const transformedImage = canvas.toDataURL("image/jpeg", 0.95);
        onCapture(transformedImage);
      };
      img.src = capturedImage;
    } else {
      onCapture(capturedImage);
    }
    
    haptic.triggerSuccess();
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
      stopCamera();
      haptic.triggerSuccess();
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    haptic.triggerLight();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
    haptic.triggerLight();
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
    haptic.triggerLight();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera View */}
      {!capturedImage && (
        <div className="relative w-full h-full">
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>
          )}

          {/* Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-[120px] font-bold text-white animate-scale-in">
                {countdown}
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                haptic.triggerLight();
                stopCamera();
                onClose();
              }}
              className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex gap-2">
              {/* Flash Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFlashEnabled(!flashEnabled);
                  haptic.triggerLight();
                }}
                className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
              >
                {flashEnabled ? (
                  <Zap className="h-5 w-5 text-yellow-400" />
                ) : (
                  <ZapOff className="h-5 w-5" />
                )}
              </Button>

              {/* Grid Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowGrid(!showGrid);
                  haptic.triggerLight();
                }}
                className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
              >
                <Grid3x3 className={`h-5 w-5 ${showGrid ? 'text-primary' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
            {/* Gallery Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleGallerySelect}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  haptic.triggerLight();
                  fileInputRef.current?.click();
                }}
                className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-2 border-white/30"
              >
                <ImageIcon className="h-6 w-6" />
              </Button>
            </div>

            {/* Capture Button */}
            <button
              onClick={handleCapture}
              disabled={countdown !== null}
              className="relative w-20 h-20 rounded-full bg-white hover:bg-white/90 transition-all disabled:opacity-50"
            >
              <div className="absolute inset-2 rounded-full border-4 border-black" />
            </button>

            {/* Placeholder for symmetry */}
            <div className="w-12" />
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Photo Review */}
      {capturedImage && (
        <div className="relative w-full h-full flex flex-col bg-black">
          {/* Image Preview */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
              }}
            />
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRetake}
              className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex gap-2">
              {/* Rotate */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRotate}
                className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0 disabled:opacity-30"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>

              <div className="text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0 disabled:opacity-30"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRetake}
                className="h-14 text-base font-semibold bg-black/50 backdrop-blur-md border-white/30 text-white hover:bg-black/70"
              >
                Retake
              </Button>

              <Button
                size="lg"
                onClick={handleUsePhoto}
                className="h-14 text-base font-semibold bg-success hover:bg-success/90 gap-2"
              >
                <Check className="h-5 w-5" />
                Use Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
