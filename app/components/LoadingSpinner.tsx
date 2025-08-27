import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 16, className = "" }: LoadingSpinnerProps) => {
  return (
    <Loader2 
      className={`animate-spin ${className}`} 
      size={size}
    />
  );
};

export default LoadingSpinner;



