import { useEffect } from "react";
import styles from "../Profile/Profile.module.css";

type StaticPageProps = {
  title: string;
  message: string;
};

export function StaticPage({ title, message }: StaticPageProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <section className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}
