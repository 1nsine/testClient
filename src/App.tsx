import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RealtimeProvider } from "../context/RealtimeContext";
import { useUser } from "../context/UserContext";
import { AdminRoute } from "./Components/AdminRoute/AdminRoute";
import { OffineBanner } from "./Components/OffineBanner/OffineBanner";
import { getGuestId } from "./Config/socket";
import { useNotifications } from "./hooks/useNotifications";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import BlankLayout from "./layout/Blanklayout";
import Layout from "./layout/Layout";
import { AdminPanel } from "./Pages/AdminPanel/AdminPanel";
import Home from "./Pages/Home/Home";
import { Login } from "./Pages/Login/Login";
import { Notifications } from "./Pages/Notifications/Notifications";
import { Profile } from "./Pages/Profile/Profile";
import { Register } from "./Pages/Register/Register";
import { ResultsPage } from "./Pages/Results/ResultsPage";
import { StaticPage } from "./Pages/StaticPage/StaticPage";
import { Premium } from "./Pages/Premium/Premium";
import Test from "./Pages/Test/Test";
import { Error } from "./UI/Error/Error";
import Privacy from "./Pages/Privacy/Privacy";
import Terms from "./Pages/Terms/Terms";
import { RecoveryRequest } from "./Pages/PasswordRecovery/RecoveryRequest/RecoveryRequest";
import { ConfirmCode } from "./Pages/PasswordRecovery/ConfirmCode/ConfirmCode";
import { ConfirmPassword } from "./Pages/PasswordRecovery/ConfirmPassword/ConfirmPassword";
import { Settings } from "./Pages/Settings/Settings";
import { Confirm2FA } from "./Pages/Login/2FA/Confirm2FA";

function App() {
  const { user } = useUser();
  const guestId = useMemo(() => (user ? null : getGuestId()), [user]);

  useNotifications();

  const theme: "light" | "dark" = (localStorage.getItem("theme") || "light") as
    | "light"
    | "dark";
  const isOnline = useOnlineStatus();

  return (
    <RealtimeProvider userId={user?.id ?? null} guestId={guestId}>
      {!isOnline && <OffineBanner />}

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        theme={theme}
      />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/premium" element={<Premium />} />
          <Route
            path="/reviews"
            element={
              <StaticPage
                title="Отзывы"
                message="Отзывы доступны на главной странице приложения."
              />
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/contact"
            element={
              <StaticPage
                title="Сообщить об ошибке"
                message="Для связи пока используйте email support@pddgo.com."
              />
            }
          />
        </Route>

        <Route element={<BlankLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login/confirm" element={<Confirm2FA />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<RecoveryRequest />} />
          <Route path="/forgot-password/confirm" element={<ConfirmCode />} />
          <Route
            path="/forgot-password/reset-password"
            element={<ConfirmPassword />}
          />
          <Route path="/test" element={<Test />} />
          <Route
            path="/admin-panel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="*"
            element={
              <Error
                statusCode={404}
                error="Страница не найдена"
                message="Не удалось обнаружить интересующий вас ресурс. Возможно указан неверный URL или страница была перемещена."
              />
            }
          />
        </Route>
      </Routes>
    </RealtimeProvider>
  );
}

export default App;
