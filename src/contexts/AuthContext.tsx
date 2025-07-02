import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "@/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  password?: string; // Add password for temporary storage
  profileImage?: string;
  timezone?: string;
  jobTitle?: string;
  company?: string;
  socialCareWork?: string[];
  profileCompleted: boolean;
  joinedDate: string;
  language?: string;
  headline?: string;
  // Added fields
  phone?: string;
  que1?: string;
  que2?: string;
  tag_id?: number[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("cusp-user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Normalize socialCareWork to always be an array
      let socialCareWork: string[] = [];
      if (Array.isArray(parsedUser.socialCareWork)) {
        socialCareWork = parsedUser.socialCareWork;
      } else if (
        typeof parsedUser.socialCareWork === "string" &&
        parsedUser.socialCareWork.trim() !== ""
      ) {
        socialCareWork = [parsedUser.socialCareWork];
      }
      setUser({ ...parsedUser, socialCareWork });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Real API call
    const res = await loginUser({ email, password });
    const apiUser = res.user;
    // Ensure socialCareWork is always an array
    let socialCareWork: string[] = [];
    if (Array.isArray(apiUser.socialCareWork)) {
      socialCareWork = apiUser.socialCareWork;
    } else if (
      typeof apiUser.socialCareWork === "string" &&
      apiUser.socialCareWork.trim() !== ""
    ) {
      socialCareWork = [apiUser.socialCareWork];
    }

    // Fix profile_photo URL
    let profileImage = apiUser.profile_photo;
    if (profileImage && profileImage.includes("localhost")) {
      profileImage = profileImage.replace("localhost", "31.97.56.234");
    }

    // Convert tag_id to array of numbers
    let tag_id: number[] = [];
    if (Array.isArray(apiUser.tag_id)) {
      tag_id = apiUser.tag_id;
    } else if (
      typeof apiUser.tag_id === "string" &&
      apiUser.tag_id.trim() !== ""
    ) {
      tag_id = apiUser.tag_id
        .split(",")
        .map((id: string) => Number(id.trim()))
        .filter(Boolean);
    }

    const user: User = {
      id: apiUser.id.toString(),
      email: apiUser.email,
      fullName: apiUser.username,
      profileImage,
      timezone: apiUser.timezone,
      jobTitle: apiUser.job_title,
      company: apiUser.company_name,
      language: apiUser.language,
      headline: apiUser.headline,
      profileCompleted: true,
      joinedDate: new Date().toISOString(), // You may want to use a real field
      socialCareWork, // Always an array
      phone: apiUser.phone || "",
      que1: apiUser.que1 || "",
      que2: apiUser.que2 || "",
      tag_id,
    };
    setUser(user);
    localStorage.setItem("cusp-user", JSON.stringify(user));
    localStorage.setItem("cusp-token", res.token);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    // No API call here now, just store in context for CompleteProfile
    setUser({
      id: Date.now().toString(),
      email,
      fullName,
      password, // Store password temporarily for CompleteProfile
      profileCompleted: false,
      joinedDate: new Date().toISOString(),
      socialCareWork: [],
      phone: "",
      que1: "",
      que2: "",
      tag_id: [],
    });
    localStorage.setItem(
      "cusp-user",
      JSON.stringify({
        id: Date.now().toString(),
        email,
        fullName,
        password,
        profileCompleted: false,
        joinedDate: new Date().toISOString(),
        socialCareWork: [],
        phone: "",
        que1: "",
        que2: "",
        tag_id: [],
      })
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cusp-user");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("cusp-user", JSON.stringify(updatedUser));
    }
  };

  const completeProfile = async (data: Partial<User>) => {
    if (user) {
      // Remove password from user after registration
      const updatedUser = { ...user, ...data, profileCompleted: true };
      delete updatedUser.password;
      setUser(updatedUser);
      localStorage.setItem("cusp-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        completeProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
