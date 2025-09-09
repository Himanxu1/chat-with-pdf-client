/**
 * Password validation utilities with security best practices
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
  score: number;
}

export enum PasswordStrength {
  WEAK = "weak",
  FAIR = "fair",
  GOOD = "good",
  STRONG = "strong",
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxLength: number;
  forbiddenPatterns: string[];
}

// Default password requirements
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  forbiddenPatterns: [
    "password",
    "123456",
    "qwerty",
    "abc123",
    "admin",
    "user",
    "test",
  ],
};

/**
 * Validate password against requirements
 */
export const validatePassword = (
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  } else {
    score += 1;
  }

  // Check maximum length
  if (password.length > requirements.maxLength) {
    errors.push(`Password must be no more than ${requirements.maxLength} characters long`);
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check for lowercase letters
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Check for numbers
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Check for special characters
  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  }

  // Check for forbidden patterns
  const lowerPassword = password.toLowerCase();
  for (const pattern of requirements.forbiddenPatterns) {
    if (lowerPassword.includes(pattern.toLowerCase())) {
      errors.push(`Password cannot contain common patterns like "${pattern}"`);
      break;
    }
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot contain more than 2 consecutive identical characters");
  } else {
    score += 1;
  }

  // Check for sequential patterns
  if (isSequentialPattern(password)) {
    errors.push("Password cannot contain sequential patterns (e.g., 123, abc)");
  } else {
    score += 1;
  }

  // Calculate strength
  const strength = calculatePasswordStrength(score, password.length);
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    strength,
    score,
  };
};

/**
 * Calculate password strength based on score and length
 */
const calculatePasswordStrength = (score: number, length: number): PasswordStrength => {
  if (score < 3 || length < 8) {
    return PasswordStrength.WEAK;
  } else if (score < 5 || length < 12) {
    return PasswordStrength.FAIR;
  } else if (score < 7 || length < 16) {
    return PasswordStrength.GOOD;
  } else {
    return PasswordStrength.STRONG;
  }
};

/**
 * Check for sequential patterns
 */
const isSequentialPattern = (password: string): boolean => {
  const sequences = [
    "0123456789",
    "abcdefghijklmnopqrstuvwxyz",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];

  const lowerPassword = password.toLowerCase();
  
  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 3; i++) {
      const pattern = sequence.substring(i, i + 3);
      if (lowerPassword.includes(pattern)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Generate a secure password suggestion
 */
export const generatePasswordSuggestion = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("");
};

/**
 * Check if password is similar to common variations
 */
export const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "abc123",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "1234567890",
    "password1",
    "qwerty123",
    "dragon",
    "master",
    "hello",
    "freedom",
    "whatever",
    "qazwsx",
    "trustno1",
  ];

  const lowerPassword = password.toLowerCase();
  return commonPasswords.some(common => 
    lowerPassword.includes(common) || 
    common.includes(lowerPassword) ||
    Math.abs(lowerPassword.length - common.length) <= 2
  );
};

/**
 * Get password strength color for UI
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return "text-red-500";
    case PasswordStrength.FAIR:
      return "text-orange-500";
    case PasswordStrength.GOOD:
      return "text-yellow-500";
    case PasswordStrength.STRONG:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Get password strength percentage for progress bar
 */
export const getPasswordStrengthPercentage = (strength: PasswordStrength): number => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 25;
    case PasswordStrength.FAIR:
      return 50;
    case PasswordStrength.GOOD:
      return 75;
    case PasswordStrength.STRONG:
      return 100;
    default:
      return 0;
  }
};
