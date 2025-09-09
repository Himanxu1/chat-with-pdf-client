"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Shield,
  CreditCard,
  BarChart3,
  Edit2,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ProfileService,
  type UpdateProfileData,
  type ChangePasswordData,
} from "@/lib/profileService";
import {
  validatePassword,
  generatePasswordSuggestion,
  PasswordValidationResult,
} from "@/lib/passwordUtils";
import { PasswordStrengthIndicator } from "../components/PasswordStrengthIndicator";
import {
  handleApiError,
  handleApiInfo,
  handleApiSuccess,
} from "@/lib/errorHandler";
import {
  AnalyticsService,
  type UsageAnalytics,
  type DocumentAnalytics,
  type ChatAnalytics,
} from "@/lib/analyticsService";

import {
  PaymentService,
  type Subscription,
  type Plan,
} from "@/lib/paymentService";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [usageInfo, setUsageInfo] = useState<any>(null);

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      isValid: false,
      errors: [],
      strength: "weak" as any,
      score: 0,
    });

  // Form validation states
  const [profileErrors, setProfileErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Analytics states
  const [usageAnalytics, setUsageAnalytics] = useState<UsageAnalytics | null>(
    null
  );
  const [documentAnalytics, setDocumentAnalytics] =
    useState<DocumentAnalytics | null>(null);
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics | null>(
    null
  );
  const [, setAnalyticsLoading] = useState(false);

  // Subscription states
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [availablePlans] = useState<Plan[]>(PaymentService.getAvailablePlans());

  const usageStats = {
    pdfsProcessed: usageInfo?.monthlyCount || 0,
    chatMessages: usageInfo?.dailyCount || 0,
    storageUsed: 68,
    collaborators: 12,
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const data = await ProfileService.getProfile();

      setUserInfo({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
      });
      setSubscriptionInfo(data.subscription);
      setUsageInfo(data.usage);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Error handling is done by the API interceptor
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchAnalytics();
    fetchSubscriptionStatus();
  }, []);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const [usage, documents, chats] = await Promise.all([
        AnalyticsService.getUsageAnalytics(),
        AnalyticsService.getDocumentAnalytics(),
        AnalyticsService.getChatAnalytics(),
      ]);

      setUsageAnalytics(usage);
      setDocumentAnalytics(documents);
      setChatAnalytics(chats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Error handling is done by the API interceptor
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    setSubscriptionLoading(true);
    try {
      const data = await PaymentService.getSubscriptionStatus();
      setCurrentSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      // Error handling is done by the API interceptor
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Validate password when it changes
  useEffect(() => {
    if (passwords.new) {
      const validation = validatePassword(passwords.new);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({
        isValid: false,
        errors: [],
        strength: "weak" as "weak" | "medium" | "strong" | "very-strong",
        score: 0,
      });
    }
  }, [passwords.new]);

  const handleSaveProfile = async () => {
    // Clear previous errors
    setProfileErrors([]);

    // Validate profile data
    const validation = ProfileService.validateProfileData(userInfo);
    if (!validation.isValid) {
      setProfileErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const updateData: UpdateProfileData = {
        firstName: userInfo.firstName.trim(),
        lastName: userInfo.lastName.trim(),
        email: userInfo.email.trim(),
      };

      await ProfileService.updateProfile(updateData);
      setIsEditMode(false);
      setProfileErrors([]);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error handling is done by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Clear previous errors
    setPasswordErrors([]);

    // Validate passwords
    const errors: string[] = [];

    if (!passwords.current) {
      errors.push("Current password is required");
    }

    if (!passwords.new) {
      errors.push("New password is required");
    } else if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    if (!passwords.confirm) {
      errors.push("Password confirmation is required");
    } else if (passwords.new !== passwords.confirm) {
      errors.push("New password and confirmation don't match");
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const passwordData: ChangePasswordData = {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      };

      await ProfileService.changePassword(passwordData);
      setPasswords({ current: "", new: "", confirm: "" });
      setPasswordErrors([]);
      setPasswordValidation({
        isValid: false,
        errors: [],
        strength: "weak",
        score: 0,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      // Error handling is done by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const suggestedPassword = generatePasswordSuggestion();
    setPasswords((prev) => ({ ...prev, new: suggestedPassword }));
    handleApiInfo(
      "Password Generated",
      "A secure password has been generated for you"
    );
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpgradePlan = async (plan: Plan) => {
    try {
      if (plan.price === 0 || plan.name === "Basic") {
        // Free plan or Basic plan - just update in database
        await PaymentService.createSubscription(plan.name);
        handleApiSuccess(
          "Plan Updated",
          `Successfully switched to ${plan.name} plan`
        );
        setIsUpgradeModalOpen(false);
        fetchSubscriptionStatus(); // Refresh subscription data
        return;
      }

      // Pro plan - create Razorpay subscription
      const subscriptionData = await PaymentService.createSubscription(
        plan.name
      );

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: subscriptionData.key,
          subscription_id: subscriptionData.subscription_id,
          name: "ChatPDF",
          description: `${plan.name} Plan Subscription`,
          image: "",
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_subscription_id: string;
            razorpay_signature: string;
          }) => {
            try {
              console.log("handler");
              await PaymentService.verifySubscription({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              });
              handleApiSuccess(
                "Payment Successful",
                `Successfully upgraded to ${plan.name} plan`
              );
              setIsUpgradeModalOpen(false);
              fetchSubscriptionStatus();
            } catch (error) {
              console.error("Payment verification failed:", error);
              handleApiError(error);
            }
          },
          prefill: {
            name: user?.firstName + " " + user?.lastName,
            email: user?.email,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: () => {
              console.log("Razorpay modal dismissed");
            },
          },
        };

        try {
          const rzp = new (
            window as typeof window & {
              Razorpay: new (options: unknown) => {
                open: () => void;
                on: (event: string, callback: () => void) => void;
              };
            }
          ).Razorpay(options);

          // Add event listeners for debugging
          rzp.on("payment.failed", (response: any) => {
            console.error("Payment failed:", response.error);
            handleApiError(
              new Error(`Payment failed: ${response.error.description}`) as any
            );
          });
          setIsUpgradeModalOpen(false); // close your modal

          rzp.open();
        } catch (error) {
          console.error("Error opening Razorpay modal:", error);
          handleApiError(error);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        handleApiError(new Error("Failed to load payment gateway") as any);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Error upgrading plan:", error);
      handleApiError(error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await PaymentService.cancelSubscription();
      fetchSubscriptionStatus(); // Refresh subscription data
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="text-black cursor-pointer">
        <ChevronLeft color="black" onClick={() => router.back()} />
      </div>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/professional-woman-diverse.png"
                alt="Profile"
              />
              <AvatarFallback className="text-lg font-semibold">
                {(userInfo.firstName + userInfo.lastName)
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-muted-foreground">{userInfo.email}</p>
              <Badge variant="secondary" className="mt-2 bg-black text-white">
                {subscriptionInfo?.plan || "Free"} Plan
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log(
                  "[v0] Toggling edit mode. Current mode:",
                  isEditMode
                );
                setIsEditMode(!isEditMode);
                if (!isEditMode) {
                  toast.info(
                    "You can now edit your profile information. Click 'Save Changes' when done."
                  );
                }
              }}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {isEditMode ? "Cancel Edit" : "Edit Profile"}
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => setIsUpgradeModalOpen(true)}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Usage Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                PDFs Processed
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {usageStats.pdfsProcessed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chat Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {usageStats.chatMessages.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Used
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {usageStats.storageUsed}%
              </div>
              <Progress value={usageStats.storageUsed} className="mt-2" />
              <p className="text-xs text-muted-foreground">
                6.8 GB of 10 GB used
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Usage Chart */}
            {/* {usageAnalytics?.trends.dailyUsage && (
              <UsageChart
                data={usageAnalytics.trends.dailyUsage.map((day) => ({
                  date: day.date,
                  pdfs: day.count,
                  chats: Math.floor(day.count * 0.7), // Estimate chat messages
                }))}
                period="7d"
              />
            )} */}

            {/* Plan Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Plan Limits & Usage
                </CardTitle>
                <CardDescription>
                  Your current usage against plan limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily PDF Limit</span>
                      <span className="font-medium">
                        {usageAnalytics?.pdfsProcessed.daily || 0} /{" "}
                        {usageAnalytics?.limits.dailyPdfLimit || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        usageAnalytics
                          ? (usageAnalytics.pdfsProcessed.daily /
                              usageAnalytics.limits.dailyPdfLimit) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly PDF Limit</span>
                      <span className="font-medium">
                        {usageAnalytics?.pdfsProcessed.monthly || 0} /{" "}
                        {usageAnalytics?.limits.monthlyPdfLimit === -1
                          ? "∞"
                          : usageAnalytics?.limits.monthlyPdfLimit || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        usageAnalytics &&
                        usageAnalytics.limits.monthlyPdfLimit !== -1
                          ? (usageAnalytics.pdfsProcessed.monthly /
                              usageAnalytics.limits.monthlyPdfLimit) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>File Size Limit</span>
                      <span className="font-medium">
                        {AnalyticsService.formatFileSize(
                          (usageAnalytics?.limits.maxFileSize || 0) *
                            1024 *
                            1024
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Maximum file size per upload
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Analytics */}
            {documentAnalytics && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Document Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Documents
                        </span>
                        <span className="font-medium">
                          {documentAnalytics.totalDocuments}
                        </span>
                      </div>
                      {documentAnalytics.documentsByType.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">By Type</h4>
                          {documentAnalytics.documentsByType.map(
                            (type, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {type.type}
                                </span>
                                <span>{type.count}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Chats
                        </span>
                        <span className="font-medium">
                          {chatAnalytics?.totalChats || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Avg Messages/Chat
                        </span>
                        <span className="font-medium">
                          {chatAnalytics?.averageMessagesPerChat.toFixed(1) ||
                            "0"}
                        </span>
                      </div>
                      {chatAnalytics?.mostActiveChats &&
                        chatAnalytics.mostActiveChats.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Most Active Chats
                            </h4>
                            {chatAnalytics.mostActiveChats
                              .slice(0, 3)
                              .map((chat, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-muted-foreground truncate">
                                    {chat.documentName}
                                  </span>
                                  <span>{chat.messageCount} msgs</span>
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {usageAnalytics?.activity.activeDays || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Days
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {usageAnalytics?.activity.streak || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Day Streak
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {usageAnalytics?.activity.averageSessionTime.toFixed(0) ||
                        0}
                      m
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Session
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {usageAnalytics?.activity.lastActive
                        ? new Date(
                            usageAnalytics.activity.lastActive
                          ).toLocaleDateString()
                        : "Never"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Errors */}
                {profileErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="space-y-1">
                      {profileErrors.map((error, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-700 flex items-start"
                        >
                          <span className="mr-2">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, firstName: e.target.value });
                        // Clear errors when user starts typing
                        if (profileErrors.length > 0) {
                          setProfileErrors([]);
                        }
                      }}
                      disabled={!isEditMode}
                      className={
                        profileErrors.some((e) => e.includes("First name"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, lastName: e.target.value });
                        if (profileErrors.length > 0) {
                          setProfileErrors([]);
                        }
                      }}
                      disabled={!isEditMode}
                      className={
                        profileErrors.some((e) => e.includes("Last name"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, email: e.target.value });
                        if (profileErrors.length > 0) {
                          setProfileErrors([]);
                        }
                      }}
                      disabled={!isEditMode}
                      className={
                        profileErrors.some(
                          (e) => e.includes("email") || e.includes("Email")
                        )
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                </div>

                <Button
                  className="mt-4"
                  onClick={handleSaveProfile}
                  disabled={!isEditMode || loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Errors */}
                {passwordErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-700 flex items-start"
                        >
                          <span className="mr-2">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Password Change Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password *</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => {
                          setPasswords({
                            ...passwords,
                            current: e.target.value,
                          });
                          if (passwordErrors.length > 0) {
                            setPasswordErrors([]);
                          }
                        }}
                        className={
                          passwordErrors.some((e) =>
                            e.includes("Current password")
                          )
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-password">New Password *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGeneratePassword}
                        className="text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => {
                          setPasswords({ ...passwords, new: e.target.value });
                          if (passwordErrors.length > 0) {
                            setPasswordErrors([]);
                          }
                        }}
                        className={
                          passwordErrors.some((e) => e.includes("New password"))
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwords.new && (
                    <PasswordStrengthIndicator
                      validation={passwordValidation}
                      showDetails={true}
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => {
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          });
                          if (passwordErrors.length > 0) {
                            setPasswordErrors([]);
                          }
                        }}
                        className={
                          passwordErrors.some(
                            (e) =>
                              e.includes("confirmation") ||
                              e.includes("don't match")
                          )
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwords.confirm &&
                      passwords.new !== passwords.confirm && (
                        <p className="text-sm text-red-600">
                          Passwords dont match
                        </p>
                      )}
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setTwoFactorEnabled(checked);
                        handleApiInfo(
                          checked
                            ? "Two-factor authentication has been enabled."
                            : "Two-factor authentication has been disabled."
                        );
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpdatePassword}
                  disabled={
                    loading ||
                    !passwordValidation.isValid ||
                    passwords.new !== passwords.confirm
                  }
                  className="w-full"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscriptionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">
                      Loading subscription...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {currentSubscription?.plan.name || "Free"} Plan
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {PaymentService.formatPrice(
                              currentSubscription?.plan.price || 0
                            )}
                            /month •
                            {currentSubscription?.plan.interval === "monthly"
                              ? " Billed monthly"
                              : " Billed yearly"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            currentSubscription?.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {currentSubscription?.status || "Inactive"}
                        </Badge>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily PDF Limit</span>
                          <span>
                            {currentSubscription?.plan.dailyPdfLimit === -1
                              ? "Unlimited"
                              : currentSubscription?.plan.dailyPdfLimit || 2}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly PDF Limit</span>
                          <span>
                            {currentSubscription?.plan.monthlyPdfLimit === -1
                              ? "Unlimited"
                              : currentSubscription?.plan.monthlyPdfLimit || 10}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max File Size</span>
                          <span>
                            {currentSubscription?.plan.maxFileSizeMb || 10} MB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage</span>
                          <span>
                            {currentSubscription?.plan.name === "Pro"
                              ? "1 TB"
                              : currentSubscription?.plan.name === "Basic"
                              ? "40 GB"
                              : "10 GB"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        disabled={subscriptionLoading}
                      >
                        {currentSubscription?.plan.name === "Pro"
                          ? "Manage Plan"
                          : "Upgrade Plan"}
                      </Button>
                      {currentSubscription?.status === "active" &&
                        currentSubscription?.plan.price > 0 && (
                          <Button
                            variant="outline"
                            onClick={handleCancelSubscription}
                            disabled={subscriptionLoading}
                          >
                            Cancel Subscription
                          </Button>
                        )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade Modal */}
        <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
          <DialogContent className="max-w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Choose Your Plan
              </DialogTitle>
              <DialogDescription className="text-center">
                Upgrade your subscription to unlock more features and
                capabilities
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-3 mt-6">
              {availablePlans.map((plan) => {
                const isCurrentPlan =
                  currentSubscription?.plan.name === plan.name;
                const isPopular = plan.name === "Pro";
                const canUpgrade = PaymentService.canUpgrade(
                  currentSubscription?.plan.name || "Free",
                  plan.name
                );

                return (
                  <Card
                    key={plan.name}
                    className={`relative ${isPopular ? "border-primary" : ""}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        {isCurrentPlan && (
                          <Badge
                            variant="outline"
                            className="border-gray-400 text-gray-600"
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">
                          {PaymentService.formatPrice(plan.price)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <CardDescription>
                        {plan.name === "Free" && "Perfect for getting started"}
                        {plan.name === "Basic" && "Great for individuals"}
                        {plan.name === "Pro" &&
                          "Best for professionals and teams"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-black" />
                          <span className="text-sm">
                            {plan.dailyPdfLimit === -1
                              ? "Unlimited"
                              : plan.dailyPdfLimit}{" "}
                            PDFs per day
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-black" />
                          <span className="text-sm">
                            {plan.monthlyPdfLimit === -1
                              ? "Unlimited"
                              : plan.monthlyPdfLimit}{" "}
                            PDFs per month
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-black" />
                          <span className="text-sm">
                            Up to {plan.maxFileSizeMb} MB file size
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-black" />
                          <span className="text-sm">
                            {plan.name === "Pro"
                              ? "1 TB"
                              : plan.name === "Basic"
                              ? "40 GB"
                              : "10 GB"}{" "}
                            storage
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-black" />
                          <span className="text-sm">
                            {plan.name === "Pro" ? "Priority" : "Email"} support
                          </span>
                        </div>
                        {plan.name === "Pro" && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-black" />
                            <span className="text-sm">Advanced analytics</span>
                          </div>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || !canUpgrade}
                        onClick={() => handleUpgradePlan(plan)}
                      >
                        {isCurrentPlan
                          ? "Current Plan"
                          : canUpgrade
                          ? `Upgrade to ${plan.name}`
                          : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              All plans include a 14-day free trial. Cancel anytime.
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
