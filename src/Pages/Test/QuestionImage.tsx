import { useState } from "react";
import styles from "./QuestionImage.module.css";
import { Loader } from "../../UI/Loader/Loader";

type QuestionImageProps = {
  src: string | null;
  alt?: string;
};

const QuestionImage: React.FC<QuestionImageProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <div className={styles.imageContainer}>
      {!loaded && (
        <div className={styles.loaderWrapper}>
          <Loader width={50} />
        </div>
      )}

      <img
        key={src}
        src={src}
        alt={alt}
        className={`${styles.img} ${loaded ? styles.visible : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

export default QuestionImage;
