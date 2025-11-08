import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-8 sm:p-12 text-center space-y-6 shadow-card animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative text-8xl sm:text-9xl font-bold bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
              404
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => navigate("/")}
            className="flex-1 gap-2"
            aria-label="Go to home page"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help? Contact support or check our{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Navigate to home page"
            >
              home page
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
