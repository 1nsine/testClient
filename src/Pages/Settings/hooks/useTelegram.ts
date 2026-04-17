import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../Config/api";

export function useTelegram() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<number | null>(null);

  const requestLinkCode = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<number>("/user/link-telegram");
      setCode(res.data);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to link Telegram.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { code, loading, requestLinkCode };
}

