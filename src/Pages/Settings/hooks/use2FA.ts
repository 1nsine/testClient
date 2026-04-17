import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../Config/api";
import { useUser } from "../../../../context/UserContext";

export interface Confirm2FAPayload {
  code: number;
}

export function use2FA() {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();

  const confirm2FA = useCallback(async ({ code }: Confirm2FAPayload) => {
    try {
      setLoading(true);
      const res = await api.post("/user/confirm2FA", { code });
      if (user?.two_factor_enabled) {
        toast.success("двух-факторная защита отключена");
      } else {
        toast.success("двух-факторная защита включена");
      }
      setUser(res.data);

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to confirm 2FA.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { confirm2FA, loading };
}
