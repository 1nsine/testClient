import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiAlertCircle,
  FiCircle,
  FiHelpCircle,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import styles from "./SideBar.module.css";

type SideBarItem = {
  id: string;
  label: string;
  active: boolean;
  badgeCount?: number;
};

type SideBarProps = {
  items: SideBarItem[];
  onSelect: (id: string) => void;
};

const icons = {
  overview: FiActivity,
  users: FiUsers,
  questions: FiHelpCircle,
  reviews: FiMessageSquare,
  feedback: FiAlertCircle,
  uptime: FiCircle,
};

export function SideBar({ items, onSelect }: SideBarProps) {
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <p className={styles.kicker}>Admin Console</p>
        <h1>PDD GO</h1>
        <p className={styles.description}>
          Управление пользователями, вопросами, отзывами и входящими жалобами в
          одном рабочем пространстве.
        </p>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? FiActivity;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.link} ${item.active ? styles.active : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <Icon size={18} />
              <div className={styles.linkContent}>
                <span>{item.label}</span>
                {item.badgeCount ? (
                  <span className={styles.navBadge}>{item.badgeCount}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <span>
          Нажимайте на разделы слева, чтобы быстро перемещаться по данным.
        </span>
        <button
          type="button"
          className={styles.exitButton}
          onClick={() => navigate("/")}
        >
          Выйти из панели
        </button>
      </div>
    </aside>
  );
}
