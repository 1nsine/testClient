import styles from "./Card.module.css";

type CardProps = {
  title: string;
  subtitle: string;
  danger?: string;
  action?: string;
  onClick?: () => void;
  compact?: boolean;
};

const Card = ({
  title,
  subtitle,
  action,
  onClick,
  danger,
  compact = false,
}: CardProps) => {
  return (
    <div className={`${styles.card} ${compact ? styles.compact : ""}`}>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <p style={{ color: "tomato" }}>{danger}</p>

      {action && (
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onClick}>
            {action}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
