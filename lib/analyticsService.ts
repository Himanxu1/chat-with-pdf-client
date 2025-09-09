import { apiMethods } from "./api";

export interface UsageAnalytics {
  // PDF Processing Metrics
  pdfsProcessed: {
    total: number;
    monthly: number;
    daily: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  
  // Chat Metrics
  chatMessages: {
    total: number;
    monthly: number;
    daily: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  
  // Storage Metrics
  storageUsed: {
    used: number; // in MB
    total: number; // in MB
    percentage: number;
    files: number;
  };
  
  // Activity Metrics
  activity: {
    activeDays: number;
    streak: number;
    lastActive: string;
    averageSessionTime: number; // in minutes
  };
  
  // Performance Metrics
  performance: {
    averageProcessingTime: number; // in seconds
    successRate: number; // percentage
    errorRate: number; // percentage
  };
  
  // Plan Limits
  limits: {
    dailyPdfLimit: number;
    monthlyPdfLimit: number;
    maxFileSize: number; // in MB
    storageLimit: number; // in MB
  };
  
  // Usage Trends
  trends: {
    dailyUsage: Array<{ date: string; count: number }>;
    weeklyUsage: Array<{ week: string; count: number }>;
    monthlyUsage: Array<{ month: string; count: number }>;
  };
}

export interface DocumentAnalytics {
  totalDocuments: number;
  documentsByType: Array<{ type: string; count: number }>;
  documentsBySize: Array<{ sizeRange: string; count: number }>;
  recentDocuments: Array<{
    id: string;
    name: string;
    size: number;
    uploadDate: string;
    status: string;
  }>;
}

export interface ChatAnalytics {
  totalChats: number;
  averageMessagesPerChat: number;
  mostActiveChats: Array<{
    id: string;
    documentName: string;
    messageCount: number;
    lastActivity: string;
  }>;
  chatTopics: Array<{ topic: string; frequency: number }>;
  engagement: {
    recentChats: number;
    monthlyChats: number;
    averageResponseTime: number;
    totalMessages: number;
  };
  distribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  longestChat: number;
  shortestChat: number;
  averageChatDuration: number;
}

export interface PerformanceAnalytics {
  processing: {
    averageProcessingTime: number;
    successRate: number;
    errorRate: number;
    totalProcessed: number;
    failedProcessing: number;
  };
  response: {
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    totalResponses: number;
  };
  system: {
    uptime: number;
    lastDowntime: string;
    averageLoadTime: number;
    cacheHitRate: number;
  };
  quality: {
    accuracyScore: number;
    relevanceScore: number;
    userSatisfaction: number;
    feedbackCount: number;
  };
}

export interface BusinessAnalytics {
  subscription: {
    planName: string;
    planPrice: number;
    billingCycle: string;
    nextBillingDate: string | null;
    status: string;
  };
  usage: {
    currentMonthUsage: number;
    planLimit: number;
    usagePercentage: number;
    daysUntilReset: number;
  };
  value: {
    estimatedSavings: number;
    timeSaved: number;
    productivityScore: number;
    roi: number;
  };
  trends: {
    monthlyGrowth: number;
    usageTrend: string;
    peakUsageDay: string;
    peakUsageHour: string;
  };
}

export class AnalyticsService {
  /**
   * Get comprehensive usage analytics
   */
  static async getUsageAnalytics(): Promise<UsageAnalytics> {
    try {
      const data = await apiMethods.get<UsageAnalytics>("/api/v1/analytics/usage");
      return data;
    } catch (error) {
      console.error("Error fetching usage analytics:", error);
      // Return default analytics if API fails
      return this.getDefaultAnalytics();
    }
  }

  /**
   * Get document analytics
   */
  static async getDocumentAnalytics(): Promise<DocumentAnalytics> {
    try {
      const data = await apiMethods.get<DocumentAnalytics>("/api/v1/analytics/documents");
      return data;
    } catch (error) {
      console.error("Error fetching document analytics:", error);
      return this.getDefaultDocumentAnalytics();
    }
  }

  /**
   * Get chat analytics
   */
  static async getChatAnalytics(): Promise<ChatAnalytics> {
    try {
      const data = await apiMethods.get<ChatAnalytics>("/api/v1/analytics/chats");
      return data;
    } catch (error) {
      console.error("Error fetching chat analytics:", error);
      return this.getDefaultChatAnalytics();
    }
  }

  /**
   * Get performance analytics
   */
  static async getPerformanceAnalytics(): Promise<PerformanceAnalytics> {
    try {
      const data = await apiMethods.get<PerformanceAnalytics>("/api/v1/analytics/performance");
      return data;
    } catch (error) {
      console.error("Error fetching performance analytics:", error);
      return this.getDefaultPerformanceAnalytics();
    }
  }

  /**
   * Get business analytics
   */
  static async getBusinessAnalytics(): Promise<BusinessAnalytics> {
    try {
      const data = await apiMethods.get<BusinessAnalytics>("/api/v1/analytics/business");
      return data;
    } catch (error) {
      console.error("Error fetching business analytics:", error);
      return this.getDefaultBusinessAnalytics();
    }
  }

  /**
   * Export analytics data
   */
  static async exportAnalytics(format: 'json' | 'csv' = 'json'): Promise<any> {
    try {
      const data = await apiMethods.get(`/api/v1/analytics/export?format=${format}`);
      return data;
    } catch (error) {
      console.error("Error exporting analytics:", error);
      throw error;
    }
  }

  /**
   * Get default analytics when API fails
   */
  private static getDefaultAnalytics(): UsageAnalytics {
    return {
      pdfsProcessed: {
        total: 0,
        monthly: 0,
        daily: 0,
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
      },
      chatMessages: {
        total: 0,
        monthly: 0,
        daily: 0,
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
      },
      storageUsed: {
        used: 0,
        total: 10240, // 10GB default
        percentage: 0,
        files: 0,
      },
      activity: {
        activeDays: 0,
        streak: 0,
        lastActive: new Date().toISOString(),
        averageSessionTime: 0,
      },
      performance: {
        averageProcessingTime: 0,
        successRate: 100,
        errorRate: 0,
      },
      limits: {
        dailyPdfLimit: 2,
        monthlyPdfLimit: 10,
        maxFileSize: 10,
        storageLimit: 10240,
      },
      trends: {
        dailyUsage: [],
        weeklyUsage: [],
        monthlyUsage: [],
      },
    };
  }

  /**
   * Get default document analytics
   */
  private static getDefaultDocumentAnalytics(): DocumentAnalytics {
    return {
      totalDocuments: 0,
      documentsByType: [],
      documentsBySize: [],
      recentDocuments: [],
    };
  }

  /**
   * Get default chat analytics
   */
  private static getDefaultChatAnalytics(): ChatAnalytics {
    return {
      totalChats: 0,
      averageMessagesPerChat: 0,
      mostActiveChats: [],
      chatTopics: [],
      engagement: {
        recentChats: 0,
        monthlyChats: 0,
        averageResponseTime: 0,
        totalMessages: 0,
      },
      distribution: {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      },
      longestChat: 0,
      shortestChat: 0,
      averageChatDuration: 0,
    };
  }

  /**
   * Get default performance analytics
   */
  private static getDefaultPerformanceAnalytics(): PerformanceAnalytics {
    return {
      processing: {
        averageProcessingTime: 0,
        successRate: 100,
        errorRate: 0,
        totalProcessed: 0,
        failedProcessing: 0,
      },
      response: {
        averageResponseTime: 0,
        fastestResponse: 0,
        slowestResponse: 0,
        totalResponses: 0,
      },
      system: {
        uptime: 100,
        lastDowntime: new Date().toISOString(),
        averageLoadTime: 0,
        cacheHitRate: 0,
      },
      quality: {
        accuracyScore: 0,
        relevanceScore: 0,
        userSatisfaction: 0,
        feedbackCount: 0,
      },
    };
  }

  /**
   * Get default business analytics
   */
  private static getDefaultBusinessAnalytics(): BusinessAnalytics {
    return {
      subscription: {
        planName: 'Free',
        planPrice: 0,
        billingCycle: 'monthly',
        nextBillingDate: null,
        status: 'active',
      },
      usage: {
        currentMonthUsage: 0,
        planLimit: 10,
        usagePercentage: 0,
        daysUntilReset: 0,
      },
      value: {
        estimatedSavings: 0,
        timeSaved: 0,
        productivityScore: 0,
        roi: 0,
      },
      trends: {
        monthlyGrowth: 0,
        usageTrend: 'stable',
        peakUsageDay: 'Monday',
        peakUsageHour: '12 PM',
      },
    };
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Format percentage for display
   */
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Get usage status color based on percentage
   */
  static getUsageStatusColor(percentage: number): string {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-orange-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-green-500";
  }

  /**
   * Calculate growth percentage
   */
  static calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Get plan limits based on subscription
   */
  static getPlanLimits(planName: string): UsageAnalytics['limits'] {
    const limits: Record<string, UsageAnalytics['limits']> = {
      Free: {
        dailyPdfLimit: 2,
        monthlyPdfLimit: 10,
        maxFileSize: 10,
        storageLimit: 10240, // 10GB
      },
      Basic: {
        dailyPdfLimit: 30,
        monthlyPdfLimit: 200,
        maxFileSize: 40,
        storageLimit: 40960, // 40GB
      },
      Pro: {
        dailyPdfLimit: 200,
        monthlyPdfLimit: -1, // unlimited
        maxFileSize: 1024, // 1GB
        storageLimit: 1048576, // 1TB
      },
    };
    
    return limits[planName] || limits.Free;
  }
}
