import type { ReactNode } from "react";
import { Error } from "../../UI/Error/Error";
import { Loader } from "../../UI/Loader/Loader";
import { useUser } from "../../../context/UserContext";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return <Loader width={48} />;
  }

  if (!user || user.role !== "admin") {
    return (
      <Error
        statusCode={403}
        error="Доступ запрещен"
        message="Эта страница доступна только администраторам."
      />
    );
  }

  return <>{children}</>;
}
