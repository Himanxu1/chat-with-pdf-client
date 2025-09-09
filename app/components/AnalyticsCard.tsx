"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  status?: "success" | "warning" | "error" | "info";
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  progress,
  status = "info",
  className = "",
}: AnalyticsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    } else {
      return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    
    if (trend.value > 0) {
      return "text-green-600";
    } else if (trend.value < 0) {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {Math.abs(trend.value).toFixed(1)}% {trend.label}
            </span>
          </div>
        )}
        
        {progress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{progress.label || "Usage"}</span>
              <span>{progress.value} / {progress.max}</span>
            </div>
            <Progress 
              value={(progress.value / progress.max) * 100} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {((progress.value / progress.max) * 100).toFixed(1)}% used
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
