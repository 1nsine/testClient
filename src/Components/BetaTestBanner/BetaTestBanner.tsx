import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export const BetaTestBanner = () => {
  const [isReaded, setIsReaded] = useState(false);

  useEffect(() => {
    const readed = localStorage.getItem("readed");
    if (readed === "true") {
      setIsReaded(true);
    }
  }, []);

  const setReaded = () => {
    localStorage.setItem("readed", "true");
    setIsReaded(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff3cd", // 🔥 не красный
        color: "#664d03",
        borderBottom: "1px solid #ffecb5",
        textAlign: "center",
        padding: "8px",
        position: "relative",
      }}
    >
      <p>
        Сервера проекта временно недоступны.Ведется работа по устранению
        неполадок
      </p>

      <FiX
        size={16}
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          cursor: "pointer",
        }}
        onClick={setReaded}
      />
    </div>
  );
};
