import { verifyCookstove } from '@/utils/cookstoveVerification';
import { LoadingOverlay } from '@/components/LoadingOverlay';

// In your upload handler:
const [isVerifying, setIsVerifying] = useState(false);
const [progress, setProgress] = useState(0);

const handleImageCapture = async (imageData: string) => {
  setIsVerifying(true);
  setProgress(0);

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    // Verify with AI
    const result = await verifyCookstove(imageData);
    
    clearInterval(progressInterval);
    setProgress(100);

    if (!result.isCleanCookstove) {
      toast.error("This doesn't appear to be a clean cookstove. Please try again with a valid cookstove.");
      setIsVerifying(false);
      return;
    }

    if (result.confidence < 70) {
      toast.warning("Low confidence in verification. Please ensure good lighting and clear photo.");
    }

    // Store results and navigate
    localStorage.setItem('verificationResult', JSON.stringify(result));
    navigate('/results');
    
  } catch (error) {
    toast.error('Verification failed. Please try again.');
  } finally {
    setIsVerifying(false);
  }
};

// In your JSX:
<LoadingOverlay 
  isVisible={isVerifying} 
  message="AI is analyzing your cookstove..." 
  progress={progress}
/>
