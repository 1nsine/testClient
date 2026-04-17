import { lazy, Suspense, useState } from "react";
const Card = lazy(() => import("../../../Components/Card/Card"));
import styles from "./ChooseMode.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../context/UserContext";
import { Loader } from "../../../UI/Loader/Loader";
import { Button } from "../../../UI/Button/Button";
const Modal = lazy(() => import("../../../Components/Modal/Modal"));
const ChooseMode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { user } = useUser();

  const handleStartTest = (mode: "infinite" | "exam") => {
    if (mode === "exam") {
      if (!user) {
        setModalOpen(true);
        return;
      }

      const today = new Date();
      const [year, month, day] = user.lastActionDate.split("-").map(Number);

      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;

      if (user.role !== "admin") {
        if (user.dailyActionCount === 0 && isToday) {
          setShowModal(true);
          return;
        }
      }
    }

    navigate("/test", { state: { mode } });
  };

  return (
    <section className={styles.mode} id="modes">
      <div className={styles.container}>
        <h2 className={styles.title}>{t("chooseMode.title")}</h2>
        <p className={styles.subtitle}>{t("chooseMode.subtitle")}</p>

        <div className="grid">
          <Suspense fallback={<Loader width={32} />}>
            <Card
              title={t("chooseMode.infinity.title")}
              subtitle={t("chooseMode.infinity.subtitle")}
              danger={t("chooseMode.infinity.danger")}
              action={t("chooseMode.infinity.start")}
              onClick={() => handleStartTest("infinite")}
            />
            <Card
              title={t("chooseMode.exam.title")}
              subtitle={`${t("chooseMode.exam.subtitle")} ${user?.premium ? "premium" : user?.dailyActionCount}`}
              danger={t("chooseMode.exam.danger")}
              action={t("chooseMode.exam.start")}
              onClick={() => handleStartTest("exam")}
            />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<Loader width={32} />}>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h3>{t("chooseMode.modalTitle")}</h3>
          <p>{t("chooseMode.modalSubtitle")}</p>
          <Button
            variant="filled"
            type="button"
            onClick={() => navigate("/login")}
          >
            {t("login")}
          </Button>
        </Modal>
      </Suspense>
      <Suspense fallback={<Loader width={32} />}>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h3>{t("chooseMode.modalTitle2")}</h3>
          <p>{t("chooseMode.modalSubtitle2")}</p>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleStartTest("infinite")}
          >
            {t("chooseMode.modalAction")}
          </Button>
        </Modal>
      </Suspense>
    </section>
  );
};

export default ChooseMode;
