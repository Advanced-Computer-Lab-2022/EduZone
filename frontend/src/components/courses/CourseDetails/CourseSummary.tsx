import React from 'react';
import { Subtitle } from '../../../types/entities/Subtitle';

const CourseSummary: React.FC<{ course?: any }> = ({ course }) => {
  return (
    <div>
      <div className="mt-4">
        <p className="text-gray-600 font-medium">
          Course Duration ≈{' '}
          {course?.subtitles &&
            Math.ceil(
              course?.subtitles?.reduce(
                (acc: any, curr: any) => acc + curr.duration,
                0
              )
            )}{' '}
          hours
        </p>
        <p className="text-xl font-medium">Summary</p>
        <p className="m text-gray-500">{course?.summary}</p>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-medium my-2">Course Sections</p>
        <hr />
        <div className="">
          {course?.subtitles?.map((section: Subtitle, index: number) => (
            <div className=" hover:bg-gray-200 p-2" key={index}>
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">{section.title}</p>
                <p className="text-sm text-gray-500">{section.duration} Hrs</p>
              </div>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CourseSummary;
