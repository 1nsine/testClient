import styles from "./Loader.module.css";
type Props = {
  width?: number;
};
export function Loader({ width = 50 }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        minHeight: width,
        minWidth: width,
      }}
    >
      <svg
        viewBox="25 25 50 50"
        className={styles.svg}
        width={width}
        height={width}
      >
        <circle r="20" cy="50" cx="50" className={styles.circle}></circle>
      </svg>
    </div>
  );
}
