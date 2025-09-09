import { apiMethods } from "./api";
import { handleApiSuccess } from "./errorHandler";

export interface Plan {
  name: string;
  price: number;
  interval: string;
  dailyPdfLimit: number;
  monthlyPdfLimit: number;
  maxFileSizeMb: number;
  razorpayPlanId?: string;
}

export interface Subscription {
  id: string;
  status: string;
  plan: Plan;
  razorpaySubscriptionId?: string;
  currentStart?: number;
  currentEnd?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
}

export interface CreateSubscriptionResponse {
  key: string;
  subscription_id: string;
}

export class PaymentService {
  /**
   * Get user's current subscription status
   */
  static async getSubscriptionStatus(): Promise<SubscriptionResponse> {
    try {
      const data = await apiMethods.get<SubscriptionResponse>("/api/v1/payment/subscription-status");
      return data;
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(tier: string): Promise<CreateSubscriptionResponse> {
    try {
      console.log("Creating subscription for tier:", tier);
      const data = await apiMethods.post<CreateSubscriptionResponse>("/api/v1/payment/subscription-start", {
        tier,
      });
      console.log("Subscription created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  /**
   * Verify subscription payment
   */
  static async verifySubscription(paymentData: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }): Promise<{ ok: boolean; error?: string }> {
    try {
      const data = await apiMethods.post("/api/v1/payment/subscription-verify", paymentData);
      return data;
    } catch (error) {
      console.error("Error verifying subscription:", error);
      throw error;
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(): Promise<{ ok: boolean }> {
    try {
      const data = await apiMethods.post("/api/v1/payment/subscription-cancel");
      handleApiSuccess("Subscription Cancelled", "Your subscription has been cancelled successfully");
      return data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  /**
   * Get available plans
   */
  static getAvailablePlans(): Plan[] {
    return [
      {
        name: "Free",
        price: 0,
        interval: "monthly",
        dailyPdfLimit: 2,
        monthlyPdfLimit: 10,
        maxFileSizeMb: 10,
      },
      {
        name: "Basic",
        price: 150000, // ₹1500 in paise
        interval: "monthly",
        dailyPdfLimit: 30,
        monthlyPdfLimit: 200,
        maxFileSizeMb: 40,
      },
      {
        name: "Pro",
        price: 300000, // ₹3000 in paise
        interval: "monthly",
        dailyPdfLimit: 200,
        monthlyPdfLimit: -1, // unlimited
        maxFileSizeMb: 1024,
      },
    ];
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    if (price === 0) return "Free";
    return `₹${price / 100}`;
  }

  /**
   * Get plan limits for display
   */
  static getPlanLimits(plan: Plan): {
    dailyPdfs: string;
    monthlyPdfs: string;
    maxFileSize: string;
    storage: string;
  } {
    return {
      dailyPdfs: plan.dailyPdfLimit === -1 ? "Unlimited" : plan.dailyPdfLimit.toString(),
      monthlyPdfs: plan.monthlyPdfLimit === -1 ? "Unlimited" : plan.monthlyPdfLimit.toString(),
      maxFileSize: `${plan.maxFileSizeMb} MB`,
      storage: plan.name === "Pro" ? "1 TB" : plan.name === "Basic" ? "40 GB" : "10 GB",
    };
  }

  /**
   * Check if user can upgrade to a plan
   */
  static canUpgrade(currentPlan: string, targetPlan: string): boolean {
    const planOrder = ["Free", "Basic", "Pro"];
    const currentIndex = planOrder.indexOf(currentPlan);
    const targetIndex = planOrder.indexOf(targetPlan);
    return targetIndex > currentIndex;
  }

  /**
   * Get next plan in upgrade path
   */
  static getNextPlan(currentPlan: string): string | null {
    const planOrder = ["Free", "Basic", "Pro"];
    const currentIndex = planOrder.indexOf(currentPlan);
    
    if (currentIndex < planOrder.length - 1) {
      return planOrder[currentIndex + 1];
    }
    
    return null;
  }
}
