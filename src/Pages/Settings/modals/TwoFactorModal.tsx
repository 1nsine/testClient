import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../../../Components/Modal/Modal";
import { Button } from "../../../UI/Button/Button";
import { CodeInput } from "../../../UI/CodeInput/CodeInput";
import { useUser } from "../../../../context/UserContext";
import { use2FA } from "../hooks/use2FA";

interface TwoFactorFormValues {
  code: string;
}

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TwoFactorModal({ isOpen, onClose }: TwoFactorModalProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const { confirm2FA, loading } = use2FA();

  const { control, handleSubmit, reset } = useForm<TwoFactorFormValues>({
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!user) return null;

  const onSubmit: SubmitHandler<TwoFactorFormValues> = async (data) => {
    const ok = await confirm2FA({
      code: Number(data.code),
    });
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} rotation="vertical">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>{t("settings.security.twoFactorAuth")}</h3>
        <p style={{ color: "var(--color-secondary)", margin: 10 }}>
          {user.two_factor_enabled
            ? t("settings.security.twoFactorAuthTitle.disable")
            : t("settings.security.twoFactorAuthTitle.enable")}
        </p>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <CodeInput length={6} onComplete={(code) => field.onChange(code)} />
          )}
        />
        <Button type="submit" variant="outline" disabled={loading}>
          {user.two_factor_enabled
            ? t("settings.security.disableTwoFactorAuth")
            : t("settings.security.enableTwoFactorAuth")}
        </Button>
      </form>
    </Modal>
  );
}
