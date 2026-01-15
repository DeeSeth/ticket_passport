'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, VerificationStatus, VERIFICATION_SCORES } from './types';
import { mockUsers } from './mock-data';
import {
  calculatePassportScore,
  isFullyVerified,
  generateVerificationCode
} from './verification-utils';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  // Verification methods
  verifyEmail: (code: string) => Promise<boolean>;
  sendEmailCode: () => Promise<boolean>;
  verifyPhone: (phone: string, code: string) => Promise<boolean>;
  sendPhoneCode: (phone: string) => Promise<boolean>;
  completeIdVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_STORAGE_KEY = 'passport_user';
const EMAIL_CODE_KEY = 'passport_email_code';
const PHONE_CODE_KEY = 'passport_phone_code';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists in mock data
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(existingUser));
      setAuthState({
        user: existingUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    // For demo: allow any login, create a new user with empty verification
    const emptyVerification: VerificationStatus = {
      emailVerified: false,
      phoneVerified: false,
      idVerified: false,
    };

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      passportScore: 0,
      isVerified: false,
      verification: emptyVerification,
      membershipStatus: 'none',
      createdAt: new Date(),
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const emptyVerification: VerificationStatus = {
      emailVerified: false,
      phoneVerified: false,
      idVerified: false,
    };

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      passportScore: 0,
      isVerified: false,
      verification: emptyVerification,
      membershipStatus: 'none',
      createdAt: new Date(),
    };

    // Generate and store email verification code
    const emailCode = generateVerificationCode();
    localStorage.setItem(EMAIL_CODE_KEY, emailCode);
    console.log('Email verification code:', emailCode); // For demo purposes

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(EMAIL_CODE_KEY);
    localStorage.removeItem(PHONE_CODE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  // Email verification
  const sendEmailCode = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const code = generateVerificationCode();
    localStorage.setItem(EMAIL_CODE_KEY, code);
    console.log('Email verification code:', code); // For demo purposes
    return true;
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedCode = localStorage.getItem(EMAIL_CODE_KEY);

    // For demo: accept any 6-digit code or the stored code
    if (code.length === 6 && (code === storedCode || code === '123456')) {
      if (authState.user) {
        const updatedVerification: VerificationStatus = {
          ...authState.user.verification,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        };

        const newScore = calculatePassportScore(updatedVerification);

        updateUser({
          verification: updatedVerification,
          passportScore: newScore,
          isVerified: isFullyVerified(updatedVerification),
        });

        localStorage.removeItem(EMAIL_CODE_KEY);
        return true;
      }
    }
    return false;
  };

  // Phone verification
  const sendPhoneCode = async (phone: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const code = generateVerificationCode();
    localStorage.setItem(PHONE_CODE_KEY, code);
    console.log('Phone verification code:', code); // For demo purposes
    return true;
  };

  const verifyPhone = async (phone: string, code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedCode = localStorage.getItem(PHONE_CODE_KEY);

    // For demo: accept any 6-digit code or the stored code
    if (code.length === 6 && (code === storedCode || code === '123456')) {
      if (authState.user) {
        // Mask the phone number for storage
        const maskedPhone = phone.length > 4
          ? `+1 ***-***-${phone.slice(-4)}`
          : phone;

        const updatedVerification: VerificationStatus = {
          ...authState.user.verification,
          phoneVerified: true,
          phoneVerifiedAt: new Date(),
          phone: maskedPhone,
        };

        const newScore = calculatePassportScore(updatedVerification);

        updateUser({
          verification: updatedVerification,
          passportScore: newScore,
          isVerified: isFullyVerified(updatedVerification),
        });

        localStorage.removeItem(PHONE_CODE_KEY);
        return true;
      }
    }
    return false;
  };

  // ID verification
  const completeIdVerification = async (): Promise<boolean> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (authState.user) {
      const updatedVerification: VerificationStatus = {
        ...authState.user.verification,
        idVerified: true,
        idVerifiedAt: new Date(),
        idType: 'drivers_license', // Default for simulation
      };

      const newScore = calculatePassportScore(updatedVerification);
      const fullyVerified = isFullyVerified(updatedVerification);

      updateUser({
        verification: updatedVerification,
        passportScore: newScore,
        isVerified: fullyVerified,
        // Activate membership when fully verified
        membershipStatus: fullyVerified ? 'active' : authState.user.membershipStatus,
        membershipExpiresAt: fullyVerified
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : authState.user.membershipExpiresAt,
      });

      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser,
        verifyEmail,
        sendEmailCode,
        verifyPhone,
        sendPhoneCode,
        completeIdVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
