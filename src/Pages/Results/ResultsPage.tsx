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
import styles from "../Profile/Profile.module.css";

export function ResultsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser();
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `${t("title")} | ${t("profile.ToResults")}`;
  }, [t]);

  useEffect(() => {
    if (!user) return;

    const loadResults = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiTestResult[]>("/test-results");
        setResults(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadResults();
  }, [user]);

  if (userLoading) {
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
          <h1>{t("profile.ToResults")}</h1>
          <Button variant="link" onClick={() => navigate("/profile")}>
            {t("profile")}
          </Button>
        </div>

        <section className={styles.resultsSection}>
          {loading ? (
            <Loader />
          ) : results.length === 0 ? (
            <p>{t("profile.Results")}: 0</p>
          ) : (
            <table width="100%" style={{ borderCollapse: "collapse" }}>
              <thead style={{ background: "var(--bg-card)" }}>
                <tr className={styles.tr}>
                  <th>{t("profile.date")}</th>
                  <th>{t("profile.time")}</th>
                  <th>{t("profile.totalQuestions")}</th>
                  <th>{t("profile.timespend")}</th>
                  <th>{t("profile.incorrectAnswers")}</th>
                  <th>{t("profile.correctAnswers")}</th>
                  <th>{t("profile.Result")}</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{formatDateOnly(result.createdAt)}</td>
                    <td>{formatTimeOnly(result.createdAt)}</td>
                    <td>40</td>
                    <td>{formatTime(result.timespend)}</td>
                    <td>{40 - result.correctAnswers}</td>
                    <td>{result.correctAnswers}</td>
                    <td
                      style={{
                        backgroundColor: result.passed ? "#4f7942" : "#b24233",
                      }}
                    >
                      {result.passed ? t("profile.passed") : t("profile.notPassed")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
