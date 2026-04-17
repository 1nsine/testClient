import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiLock, FiSettings, FiUser } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import { Badge } from "../../UI/Badge/Badge";
import { Error } from "../../UI/Error/Error";
import styles from "./Settigs.module.css";
import { SecuritySection } from "./sections/SecuritySection";
import { SiteSection } from "./sections/SiteSection";
import { UserSection } from "./sections/UserSection";

export function Settings() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [activeHash, setActiveHash] = useState(() =>
    window.location.hash ? window.location.hash : "#user",
  );

  useEffect(() => {
    document.title = `${t("title")} | ${t("settings")}`;
  }, [t]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash ? window.location.hash : "#user");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!user) {
    return (
      <Error
        statusCode={401}
        error="РќРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ."
        message="Р”РѕСЃС‚СѓРїРЅРѕ С‚РѕР»СЊРєРѕ РґР»СЏ Р°РІС‚РѕСЂРёР·РѕРІР°РЅРЅС‹С… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№"
      />
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sideBar}>
        <a
          href="#user"
          className={`${styles.link} ${
            activeHash === "#user" ? styles.active : ""
          }`}
        >
          <FiUser size={24} /> {t("settings.user")}
        </a>
        <a
          href="#security"
          className={`${styles.link} ${
            activeHash === "#security" ? styles.active : ""
          }`}
        >
          <FiLock size={24} /> {t("settings.security")}
          <Badge variant="inline" count={!user.telegram_id ? 1 : 0} />
        </a>
        <a
          href="#site"
          className={`${styles.link} ${
            activeHash === "#site" ? styles.active : ""
          }`}
        >
          <FiSettings size={24} /> {t("settings.site")}
        </a>
      </aside>

      <main className={styles.main}>
        <UserSection />
        <SecuritySection />
        <SiteSection />
      </main>
    </div>
  );
}

