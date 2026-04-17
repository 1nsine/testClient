import { FaStar } from "react-icons/fa";

type RatingProps = {
  value: number;
  max?: number;
};

const Rating = ({ value, max = 5 }: RatingProps) => {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <FaStar key={i} size={18} color={i < value ? "#f5c518" : "#dcdcdc"} />
      ))}
    </div>
  );
};

export default Rating;
