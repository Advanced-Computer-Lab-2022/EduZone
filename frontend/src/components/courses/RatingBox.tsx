import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
const RatingBox: React.FC<{
  rating: number;
  onClick: (index: number) => void;
  fixed?: boolean;
}> = ({ rating, onClick, fixed = false }) => {
  const [hoverOnStar, setHoverOnStar] = useState(-1);
  return (
    <div className="flex text-yellow-600 cursor-pointer">
      {[0, 1, 2, 3, 4].map((_, index) => {
        return (
          <div
            id={index.toString()}
            onMouseEnter={() => {
              if (!fixed) setHoverOnStar(index);
            }}
            onMouseLeave={() => {
              if (!fixed) setHoverOnStar(-1);
            }}
          >
            {hoverOnStar >= index ? (
              <FaStar
                size={20}
                onClick={() => onClick(index + 1)}
                key={index}
              />
            ) : rating >= index + 1 && hoverOnStar == -1 ? (
              <FaStar
                size={20}
                onClick={() => onClick(index + 1)}
                key={index}
              />
            ) : (
              <FaRegStar
                size={20}
                onClick={() => onClick(index + 1)}
                key={index}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingBox;
