import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '@/components/CameraCapture';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { analyzeCookstove } from '@/lib/aiAnalysis';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload as UploadIcon } from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageCapture = async (imageData: string) => {
    setShowCamera(false);
    setIsVerifying(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Verify with AI
      const result = await analyzeCookstove(imageData);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Store results and navigate
      localStorage.setItem('verificationResult', JSON.stringify({
        ...result,
        imageData
      }));
      
      toast.success('Cookstove verified successfully!');
      navigate('/results');
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-2">Upload Cookstove</h1>
          <p className="text-center text-muted-foreground mb-8">
            Take a photo of your clean cookstove to verify and earn credits
          </p>

          <div className="grid gap-4">
            <Card className="p-6 hover:shadow-card-hover transition-base cursor-pointer" onClick={() => setShowCamera(true)}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-button bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Take Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your camera to capture a new image
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card-hover transition-base cursor-pointer" onClick={() => setShowCamera(true)}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-button bg-success/10">
                  <UploadIcon className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Upload from Gallery</h3>
                  <p className="text-sm text-muted-foreground">
                    Select an existing photo from your device
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Tips for best results:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Ensure good lighting</li>
              <li>• Capture the entire cookstove</li>
              <li>• Avoid shadows or glare</li>
              <li>• Keep the camera steady</li>
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <LoadingOverlay 
        isVisible={isVerifying} 
        message="AI is analyzing your cookstove..." 
        progress={progress}
      />
    </>
  );
}
