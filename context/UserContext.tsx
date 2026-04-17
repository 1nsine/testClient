import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/Config/api";
import type { IUser } from "../src/types/types";

type RawUser = Omit<IUser, "two_factor_enabled"> & {
  two_factor_enabled: unknown;
};

const normalizeTwoFactorEnabled = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value === "true" || value === "1";
  return false;
};

const normalizeUser = (user: RawUser): IUser => ({
  ...(user as Omit<IUser, "two_factor_enabled">),
  two_factor_enabled: normalizeTwoFactorEnabled(user.two_factor_enabled),
});

interface AuthContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  reg: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    navigate("/");
  }, [clearAuth, navigate]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(normalizeUser(JSON.parse(storedUser) as RawUser));
        }
        const { data } = await api.get<RawUser>("/user/me");
        const normalizedUser = normalizeUser(data);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    void checkAuth();
  }, [logout, token]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearAuth();
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [clearAuth, navigate]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const { data } = await api.post<{
        user?: RawUser;
        token?: string;
        twoFactor?: boolean;
        userId?: string;
      }>("/user/login", {
        username,
        password,
      });

      // 👉 если включена 2FA
      if (data.twoFactor && data.userId) {
        navigate("/login/confirm", {
          state: { userId: data.userId },
        });
        return;
      }

      // 👉 обычный логин
      if (data.user && data.token) {
        const normalizedUser = normalizeUser(data.user);

        setUser(normalizedUser);
        setToken(data.token);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        navigate("/");
        return;
      }

      throw new Error("Некорректный ответ сервера");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось выполнить вход. Попробуйте еще раз.";

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };
  const reg = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);
      const { data } = await api.post<{ user: RawUser; token: string }>(
        "/user/register",
        {
          username,
          email,
          firstName,
          lastName,
          password,
        },
      );

      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      navigate("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось завершить регистрацию. Попробуйте еще раз.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, token, loading, login, reg, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
