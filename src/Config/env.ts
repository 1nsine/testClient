const DEFAULT_API_BASE_URL = "https://testserver-oc9u.onrender.com/api";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const apiBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
);

export const env = {
  apiBaseUrl,
  socketBaseUrl: apiBaseUrl.replace(/\/api$/, ""),
  telegramPremiumUrl:
    import.meta.env.VITE_TELEGRAM_PREMIUM_URL?.trim() || "https://t.me/",
} as const;
