export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: "user" | "admin";
  createdAt: string;
  email: string;
  dailyActionCount: number;
  lastActionDate: string;
  avatarUrl: string;
  premium: boolean;
  telegram_id: string | null;
  two_factor_enabled: boolean;
}

export interface Review {
  id: number;
  text: string;
  rating: number;
  user: IUser;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}
