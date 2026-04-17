import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../Components/Modal/Modal";
import ChooseMode from "./ChooseMode/ChooseMode";
import Hero from "./Hero/Hero";
import PremiumBlock from "./Premium/PremiumBlock";
import Reviews from "./Reviews/Reviews";
import { Button } from "../../UI/Button/Button";

const Home = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(() => {
    const acceptedCookie = localStorage.getItem("Cookie");
    return acceptedCookie === "false" || acceptedCookie === null;
  });

  useEffect(() => {
    document.title = `${t("title")} | ${t("home.page")}`;
  }, [t]);

  const handleCookieAccept = () => {
    setShowModal(false);
    localStorage.setItem("Cookie", "true");
  };

  return (
    <>
      <Hero />
      <ChooseMode />
      <PremiumBlock />
      <Reviews />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>{`🍪 ${t("cookie.title")}`}</h3>
        <p>{t("cookie.subtitle")}</p>
        <Button
          variant="filled"
          onClick={handleCookieAccept}
          style={{ maxWidth: "30%" }}
        >
          {t("cookie.action")}
        </Button>
      </Modal>
    </>
  );
};

export default Home;
