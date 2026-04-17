import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/UserContext";
import api from "../../Config/api";
import formatTime from "../../hooks/useFormatTime";
import type { ApiTestResult } from "../../types/api";
import { formatDateOnly, formatTimeOnly } from "../../utils/date";
import { Button } from "../../UI/Button/Button";
import { Error } from "../../UI/Error/Error";
import { Loader } from "../../UI/Loader/Loader";
import styles from "./Profile.module.css";

export function Profile() {
  const navigate = useNavigate();
  const [results, setResuls] = useState<ApiTestResult[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();
  const [load, setLoad] = useState<boolean>(false);
  const { user, loading } = useUser();

  useEffect(() => {
    document.title = `${t("title")} | ${t("profile")}`;

    const loadResults = async () => {
      try {
        setLoad(true);
        const response = await api.get<ApiTestResult[]>("/test-results");
        setResuls(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
    };

    void loadResults();
  }, [t]);

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <Error
        statusCode={401}
        error="Не удалось вас распознать"
        message="Мы не смогли проверить ваш токен. Попробуйте войти в систему повторно."
      />
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <div className={styles.userInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={styles.avatarWrap}>
              {!loaded && <Loader width={64} />}
              <img
                src={user.avatarUrl}
                alt={user.username}
                width={64}
                height={64}
                className={styles.avatar}
                style={{ display: loaded ? "block" : "none" }}
                onLoad={() => setLoaded(true)}
              />
              {user.premium && (
                <span
                  className={styles.crown}
                  aria-label="Premium user"
                  title="Premium"
                >
                  {"\uD83D\uDC51"}
                </span>
              )}
            </div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
          </div>
          <div>
            <p style={{ color: "var(--color-secondary)" }}>
              Аккаунт создан:
              {formatDateOnly(user.createdAt, "ru-RU", { month: "short" })}
            </p>
            {!user.premium && (
              <Button
                variant="filled"
                type="button"
                onClick={() => navigate("/premium")}
              >
                Купить Premium
              </Button>
            )}
          </div>
        </div>
        <section className={styles.resultsSection}>
          <h2 style={{ marginBottom: "1rem" }}>{t("profile.Results")}</h2>

          {!results.length ? (
            <p>
              {t("profile.noResults")}
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/#modes")}
              >
                {t("profile.freeStart")}
              </Button>
            </p>
          ) : load ? (
            <Loader />
          ) : (
            <table width="100%" style={{ borderCollapse: "collapse" }}>
              <thead style={{ background: "var(--bg-card)" }}>
                <tr className={styles.tr}>
                  <th>{t("profile.date")}</th>
                  <th>{t("profile.time")}</th>
                  {user.premium ? (
                    <>
                      {" "}
                      <th>{t("profile.totalQuestions")}</th>
                      <th>{t("profile.timespend")}</th>
                      <th>{t("profile.incorrectAnswers")}</th>
                      <th>{t("profile.correctAnswers")}</th>
                    </>
                  ) : null}
                  <th>{t("profile.Result")}</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 3).map((result) => (
                  <tr key={result.id}>
                    <td>{formatDateOnly(result.createdAt)}</td>
                    <td>{formatTimeOnly(result.createdAt)}</td>
                    {user.premium ? (
                      <>
                        <td>40</td>
                        <td>{formatTime(result.timespend)}</td>
                        <td>{40 - result.correctAnswers}</td>
                        <td>{result.correctAnswers}</td>
                      </>
                    ) : null}
                    <td
                      style={{
                        backgroundColor: result.passed ? "#4f7942" : "#b24233",
                      }}
                    >
                      {result.passed
                        ? t("profile.passed")
                        : t("profile.notPassed")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {results.length > 3 ? (
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/results")}
            >
              {t("profile.ToResults")}
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
