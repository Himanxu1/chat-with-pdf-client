import { apiMethods } from "./api";
import { handleApiSuccess, handleApiInfo } from "./errorHandler";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
}

export interface UsageInfo {
  dailyCount: number;
  monthlyCount: number;
}

export interface ProfileData {
  user: UserProfile;
  subscription: SubscriptionInfo | null;
  usage: UsageInfo | null;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export class ProfileService {
  /**
   * Get user profile data
   */
  static async getProfile(): Promise<ProfileData> {
    try {
      const data = await apiMethods.get<ProfileData>("/api/v1/profile");
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    try {
      const data = await apiMethods.put<UserProfile>("/api/v1/profile", profileData);
      
      // Update local storage with new user data
      if (typeof window !== "undefined") {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      handleApiSuccess("Profile Updated", "Your profile has been updated successfully");
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      await apiMethods.put("/api/v1/profile/password", passwordData);
      
      handleApiSuccess("Password Changed", "Your password has been changed successfully");
      
      // Show security tip
      handleApiInfo("Security Tip", "Consider logging out and logging back in on all devices for security");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return { isValid: false, error: "Email is required" };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
    
    return { isValid: true };
  }

  /**
   * Validate name fields
   */
  static validateName(name: string, fieldName: string): { isValid: boolean; error?: string } {
    if (!name.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    if (name.trim().length > 50) {
      return { isValid: false, error: `${fieldName} must be no more than 50 characters long` };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }
    
    return { isValid: true };
  }

  /**
   * Validate profile data
   */
  static validateProfileData(data: UpdateProfileData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate first name
    const firstNameValidation = this.validateName(data.firstName, "First name");
    if (!firstNameValidation.isValid) {
      errors.push(firstNameValidation.error!);
    }
    
    // Validate last name (optional)
    if (data.lastName.trim()) {
      const lastNameValidation = this.validateName(data.lastName, "Last name");
      if (!lastNameValidation.isValid) {
        errors.push(lastNameValidation.error!);
      }
    }
    
    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get subscription plan display name
   */
  static getPlanDisplayName(plan: string): string {
    const planNames: Record<string, string> = {
      Free: "Free Plan",
      Basic: "Basic Plan",
      Pro: "Pro Plan",
    };
    
    return planNames[plan] || plan;
  }

  /**
   * Get plan limits for display
   */
  static getPlanLimits(plan: string): {
    dailyPdfs: number;
    monthlyPdfs: number | string;
    maxFileSize: string;
  } {
    const limits: Record<string, { dailyPdfs: number; monthlyPdfs: number | string; maxFileSize: string }> = {
      Free: {
        dailyPdfs: 2,
        monthlyPdfs: 10,
        maxFileSize: "10 MB",
      },
      Basic: {
        dailyPdfs: 30,
        monthlyPdfs: 200,
        maxFileSize: "40 MB",
      },
      Pro: {
        dailyPdfs: 200,
        monthlyPdfs: "Unlimited",
        maxFileSize: "1 GB",
      },
    };
    
    return limits[plan] || limits.Free;
  }

  /**
   * Check if user can upgrade plan
   */
  static canUpgrade(currentPlan: string): boolean {
    const upgradeOrder = ["Free", "Basic", "Pro"];
    const currentIndex = upgradeOrder.indexOf(currentPlan);
    return currentIndex < upgradeOrder.length - 1;
  }

  /**
   * Get next plan in upgrade path
   */
  static getNextPlan(currentPlan: string): string | null {
    const upgradeOrder = ["Free", "Basic", "Pro"];
    const currentIndex = upgradeOrder.indexOf(currentPlan);
    
    if (currentIndex < upgradeOrder.length - 1) {
      return upgradeOrder[currentIndex + 1];
    }
    
    return null;
  }
}

