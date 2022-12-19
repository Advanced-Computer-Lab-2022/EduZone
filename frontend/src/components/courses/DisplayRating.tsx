import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const DisplayRating: React.FC<{
  rating: number;
  size?: number;
}> = ({ rating, size = 20 }) => {
  return (
    <div className="flex text-yellow-600 cursor-pointer">
      {[0, 1, 2, 3, 4].map((_, index) => {
        return (
          <div id={index.toString()}>
            {rating >= index + 1 ? (
              <FaStar size={size} key={index} />
            ) : rating >= index + 0.5 ? (
              <FaStarHalfAlt size={size} key={index} />
            ) : (
              <FaRegStar size={size} key={index} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DisplayRating;
