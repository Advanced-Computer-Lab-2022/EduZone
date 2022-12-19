import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Course } from '../../types/entities/Course';
import { calculateCourseRating } from '../../utils';
import Truncate from '../common/Truncate';
import DisplayRating from './DisplayRating';

const CourseCardBlock: React.FC<{ course: Course }> = ({ course }) => {
  const { total, rating } = calculateCourseRating(course);
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  return (
    <div
      key={course._id.toString()}
      className="w-full bg-white shadow-md  rounded-lg  duration-150 flex flex-col"
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
          <p className="text-sm font-medium font-sans text-gray-700">
            {course.subtitles &&
              Math.ceil(
                course?.subtitles?.reduce(
                  (acc: any, curr: any) => acc + curr.duration,
                  0
                )
              ) + ' hrs'}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          <Truncate text={course.summary || ''} length={10} more />
        </div>
        <p className="text-sm mt-2">
          By: {course.instructor?.name ?? 'Unknown Instructor'}
        </p>
        <div className=" mt-auto w-full flex items-center pt-2 font-sans justify-between">
          <p className="text-xl font-semibold text-primary">
            {Number(
              course?.price *
                (1 - (course?.discount?.amount ?? 0) / 100) *
                conversion_rate
            ).toFixed(2)}{' '}
            <span className="text-xs ">{currency}</span>
          </p>
          <Link to={`/courses/${course?._id}`}>
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
