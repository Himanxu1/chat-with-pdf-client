"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthPercentage,
  PasswordValidationResult 
} from "@/lib/passwordUtils";

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult;
  showDetails?: boolean;
}

export function PasswordStrengthIndicator({ 
  validation, 
  showDetails = true 
}: PasswordStrengthIndicatorProps) {
  const { strength, score, errors } = validation;
  const percentage = getPasswordStrengthPercentage(strength);
  const colorClass = getPasswordStrengthColor(strength);

  const getStrengthLabel = (strength: PasswordStrength): string => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "Weak";
      case PasswordStrength.FAIR:
        return "Fair";
      case PasswordStrength.GOOD:
        return "Good";
      case PasswordStrength.STRONG:
        return "Strong";
      default:
        return "Unknown";
    }
  };

  const getProgressColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "bg-red-500";
      case PasswordStrength.FAIR:
        return "bg-orange-500";
      case PasswordStrength.GOOD:
        return "bg-yellow-500";
      case PasswordStrength.STRONG:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password Strength</span>
          <Badge 
            variant="outline" 
            className={`${colorClass} border-current`}
          >
            {getStrengthLabel(strength)}
          </Badge>
        </div>
        <Progress 
          value={percentage} 
          className="h-2"
        />
        <div className="text-xs text-muted-foreground">
          Score: {score}/8
        </div>
      </div>

      {/* Validation Details */}
      {showDetails && errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-600">Requirements not met:</h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-xs text-red-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Security Tips */}
      {showDetails && strength === PasswordStrength.WEAK && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Security Tips:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Use a mix of uppercase and lowercase letters</li>
            <li>• Include numbers and special characters</li>
            <li>• Avoid common words and patterns</li>
            <li>• Make it at least 12 characters long</li>
          </ul>
        </div>
      )}
    </div>
  );
}
