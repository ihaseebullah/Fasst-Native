export interface User {
  email: string;
  password: string;
  address?: string;
  DailyChallenges?: string[];
  ChallengesCompleted?: string[];
  GYM_POINTS?: number;
  calories?: number;
  diet_type?: string;
  LastChallengeIssueDate?: Date;
  HEALTH_MATRICS?: string;
  SOCIAL_USER?: string;
  GOALS?: string[];
  WORKOUTS?: string[];
  INSIGHT?: string;
  OTP?: string;
  isVerified?: boolean;
  VFCP?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface App_Data {
  user: User;
  isLoggedIn?: boolean;
  Health_Metrics_Created?: boolean;
  accountExist?: boolean;
}

export interface SOCIAL_USER {
  userId: string;
  username: string;
  profilePic?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  preferences?: {
    visibility: "public" | "private";
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  appData: App_Data | undefined;
  setAppData: React.Dispatch<React.SetStateAction<App_Data | undefined>>;
  socialUser: SOCIAL_USER | undefined;
  setSocialUser: React.Dispatch<React.SetStateAction<SOCIAL_USER | undefined>>;
}
