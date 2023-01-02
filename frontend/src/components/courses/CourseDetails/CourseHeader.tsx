import React from 'react';
import DisplayRating from '../DisplayRating';

const CourseHeader: React.FC<{ title: string; rating?: number }> = ({
  title,
  rating,
}) => {
  return (
    <div className=" justify-between items-center">
      <p className="text-4xl font-medium">{title}</p>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span>Rating: </span>{' '}
        {rating ? <DisplayRating rating={rating ?? 0} /> : 'No Rating yet'}
      </p>
    </div>
  );
};

export default CourseHeader;
