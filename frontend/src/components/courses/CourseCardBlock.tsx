import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { CourseCardProps } from '../../types';
import { Course } from '../../types/entities/Course';
import { calculateCourseRating } from '../../utils';
import Truncate from '../common/Truncate';
import DisplayRating from './DisplayRating';
import moment from 'moment';
const CourseCardBlock: React.FC<CourseCardProps> = ({ course, base }) => {
  const { total, rating } = calculateCourseRating(course);
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  const navigate = useNavigate();
  const [discount, setDiscount] = useState({
    ...course.discount,
    valid:
      course?.discount &&
      new Date(course?.discount?.validFrom) <= new Date() &&
      new Date(course?.discount?.validUntil) >= new Date(),
  });

  console.log(
    course?.discount &&
      new Date(course?.discount?.validFrom) <= new Date() &&
      new Date(course?.discount?.validUntil) >= new Date()
  );

  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    setDiscount({
      ...course.discount,
      valid:
        course?.discount &&
        new Date(course?.discount?.validFrom) <= new Date() &&
        new Date(course?.discount?.validUntil) >= new Date(),
    });

    setDuration({
      hours:
        (course.subtitles &&
          Math.floor(
            course?.subtitles?.reduce(
              (acc: any, curr: any) => acc + curr.duration,
              0
            )
          )) ||
        0,
      minutes:
        (course.subtitles &&
          (course?.subtitles?.reduce(
            (acc: any, curr: any) => acc + curr.duration,
            0
          ) *
            60) %
            60) ||
        0,
    });
  }, [course]);

  return (
    <div
      key={course._id.toString()}
      className="w-full bg-white shadow-sm hover:shadow-md  rounded-lg duration-150 flex flex-col relative cursor-pointer"
    >
      <img
        src={
          course.thumbnail ??
          'https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg'
        }
        alt={course.title}
        className="h-48 rounded-t-lg w-full object-cover "
      />

      <div className="p-4 flex flex-col grow">
        <div className="text-lg font-semibold ">{course.title}</div>
        <div className="-mt-1 mb-2">
          {total === 0 ? (
            <div className="text-xs text-gray-600  italic">No ratings yet</div>
          ) : (
            <div className="flex gap-1 items-center">
              <DisplayRating rating={rating} size={15} />
              <span className="text-sm text-gray-500 font-serif">
                ({total})
              </span>
            </div>
          )}
          <p className="text-sm font-medium font-sans text-gray-500">
            {duration.hours > 0 && <span>{duration.hours}h </span>}{' '}
            {duration.minutes > 0 && (
              <span> {Math.ceil(duration.minutes)}m</span>
            )}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          <Truncate text={course.summary || ''} length={10} more />
        </div>
        <p className="text-sm mt-2">
          By: {course.instructor?.name ?? 'Unknown Instructor'}
        </p>
        <div className=" mt-auto w-full flex items-center pt-2 font-sans justify-between">
          <div>
            {discount.valid && (
              <p className="text-sm text-gray-500 line-through">
                {Number(course?.price * conversion_rate).toFixed(2)}{' '}
                <span className="text-xs ">{currency}</span>
              </p>
            )}
            <p className="text-xl font-semibold text-primary">
              {discount.valid
                ? Number(
                    course?.price *
                      (1 - (course?.discount?.amount ?? 0) / 100) *
                      conversion_rate
                  ).toFixed(2)
                : Number(course?.price * conversion_rate).toFixed(2)}{' '}
              <span className="text-xs ">{currency}</span>
            </p>
          </div>
          <Link to={`${base || ''}/courses/${course._id}`}>
            <button className="bg-primary text-white text-sm py-2 px-4 rounded ">
              View Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCardBlock;
