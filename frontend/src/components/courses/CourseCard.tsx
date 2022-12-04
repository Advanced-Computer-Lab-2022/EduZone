import React, { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { CourseCardProps } from '../../types';
import Truncate from '../common/Truncate';
const CourseCard: React.FC<CourseCardProps> = ({ course, base }) => {
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );

  const [rating, setRating] = useState(undefined as number | undefined);

  const calculateRating = () => {
    let total = 0;
    let sum = 0;
    course?.enrolled?.map((s: any) => {
      if (s.rating) {
        sum += s.rating;
        total++;
      }
    });

    if (total === 0) setRating(undefined);
    else setRating(sum / total);
  };

  useEffect(() => {
    calculateRating();
  }, [currency]);
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center w-full bg-gray-100 h-52 rounded-lg p-4 border gap-4 hover:border-primary cursor-pointer transition-all duration-300 ease-in-out"
      onClick={() => navigate(`${base || ''}/courses/${course._id}`)}
    >
      <img
        src={
          course.thumbnail ??
          'https://via.placeholder.com/150/DEDEDE/808080?text=Thumbnail'
        }
        alt=""
        className="h-full rounded-lg aspect-square"
      />
      <div className="px-4 w-full">
        <div className="flex justify-between w-full ">
          <div className="text-2xl font-bold ">{course.title}</div>
          <div className="text-xl font-medium ">
            {Number(
              course?.price *
                (1 - (course?.discount?.amount ?? 0) / 100) *
                conversion_rate
            ).toFixed(2)}{' '}
            {currency}
          </div>
        </div>
        <div className="flex justify-between w-full ">
          {course?.instructor?.name && (
            <div className="flex items-center gap-2 text-gray-500 ">
              <FaUserAlt />
              <p className=" ">{course?.instructor?.name}</p>
            </div>
          )}
        </div>
        <div>
          Rating:{' '}
          <span className="italic text-sm text-primary">
            {rating || ' No reviews yet'}
          </span>
        </div>
        <div className="text-gray-700 text-sm mt-2 ">
          <Truncate text={course.summary || ''} length={40} more />
        </div>
        <div className="mt-2 text-sm text-gray-500 font-medium">
          Duration ≈{' '}
          {course.subtitles &&
            Math.ceil(
              course?.subtitles?.reduce(
                (acc: any, curr: any) => acc + curr.duration,
                0
              )
            ) + ' hrs'}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
