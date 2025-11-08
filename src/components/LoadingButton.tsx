import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "./ui/button";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({ 
  isLoading = false, 
  loadingText = "Loading...",
  children,
  disabled,
  className,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button 
      disabled={disabled || isLoading} 
      className={cn(
        isLoading && "cursor-not-allowed opacity-80",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
