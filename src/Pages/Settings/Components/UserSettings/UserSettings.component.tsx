import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../../../../UI/Input/Input";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../UI/Button/Button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../../Config/api";
import { useUser } from "../../../../../context/UserContext";

interface IUserSettingsForm {
  firstName: string;
  lastName: string;
  email: string;
}
export function UserSettings() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSettingsForm>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<IUserSettingsForm> = async (data) => {
    try {
      setLoading(true);
      const res = await api.put("/user", data);
      setUser(res.data);
      toast.success(`${t("settings.user.updateSuccess")}!`);
    } catch (submitError) {
      if (axios.isAxiosError(submitError)) {
        toast.error(submitError.response?.data.message);
      } else if (submitError instanceof Error) {
        toast.error((submitError as Error).message);
      } else {
        toast.error("Не удалось выполнить действие.");
      }
    } finally {
      setLoading(false);
    }
    console.log(data);
  };
  if (!user) return;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={t("settings.user.firstName")}
          defaultValue={user.firstName}
          {...register("firstName", {
            required: t("feedback.titleError"),
            minLength: {
              value: 3,
              message: t("feedback.minLength"),
            },
          })}
        />
        <p className="error">{errors.firstName?.message || " "}</p>
        <Input
          label={t("settings.user.lastName")}
          defaultValue={user.lastName}
          {...register("lastName", {
            required: t("feedback.titleError"),
            minLength: {
              value: 3,
              message: t("feedback.minLength"),
            },
          })}
        />
        <p className="error">{errors.lastName?.message || " "}</p>
        <Input
          label={t("settings.user.email")}
          defaultValue={user.email}
          {...register("email", {
            required: t("feedback.titleError"),
            minLength: {
              value: 3,
              message: t("feedback.minLength"),
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("email.invalid") || "Invalid email",
            },
          })}
        />
        <p className="error">{errors.email?.message || " "}</p>
        <Button variant="filled" type="submit" disabled={loading}>
          {t("settings.user.saveChanges")}
        </Button>
      </form>
    </div>
  );
}
