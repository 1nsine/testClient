import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../Config/api";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    try {
      setLoading(true);
      await api.patch("/user/change-password", payload);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to change password.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { changePassword, loading };
}

