import styles from "./Badge.module.css";

type BadgeVariant = "corner" | "inline";

export function Badge({
  count,
  variant = "corner",
}: {
  count: number;
  variant?: BadgeVariant;
}) {
  if (!count) return null;

  return (
    <span className={variant === "inline" ? styles.badgeInline : styles.badge}>
      {count}
    </span>
  );
}
