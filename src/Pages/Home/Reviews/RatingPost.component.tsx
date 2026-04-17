import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface RatingPostProps {
  value?: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function RatingPost({
  value = 0,
  onChange,
  max = 5,
}: RatingPostProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;

        return (
          <span
            key={starValue}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(starValue)}
            style={{
              cursor: "pointer",
              fontSize: "28px",
              transition: "0.2s",
              color: starValue <= (hover || value) ? "gold" : "#ccc",
            }}
          >
            <FaStar key={i} size={18} />
          </span>
        );
      })}
    </div>
  );
}
