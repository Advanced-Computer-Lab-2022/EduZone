import React, { useEffect, useState } from 'react';
import { BsFileEarmarkText, BsPencilSquare, BsPlayFill } from 'react-icons/bs';

declare type CourseItemProps = {
  index: number;
  courseItems: any[];
  currentCourseItem: number;
  onClickItem: (index: number) => void;
  item: any;
  completed: boolean;
  score: number;
};
const CourseItem: React.FC<CourseItemProps> = ({
  index,
  courseItems,
  currentCourseItem,
  onClickItem,
  item,
  completed,
  score,
}) => {
  return (
    <div
      key={index}
      className={`flex items-center justify-between p-2 my-1 border border-gray-300 rounded-md cursor-pointer  ${
        currentCourseItem === index + 1 ? 'bg-gray-200' : 'hover:bg-gray-200'
      }`}
      onClick={() => onClickItem(index)}
    >
      <div className="flex items-center">
        <div
          className={`w-8 h-8  rounded-full flex items-center justify-center ${
            completed
              ? item.type !== 'subtitle' && score < 50
                ? 'bg-red-600 text-white'
                : 'bg-green-600 text-white'
              : 'bg-gray-300 text-gray-600'
          } `}
        >
          {item.type === 'subtitle' ? (
            <BsPlayFill size={20} className="translate-x-[1px]" />
          ) : item.type === 'exercise' ? (
            <BsPencilSquare size={15} />
          ) : (
            <BsFileEarmarkText size={15} />
          )}
        </div>
        <div className="ml-2">
          <p className="text-sm font-semibold">
            {item.type === 'subtitle'
              ? item.data.title
              : item.type === 'exercise'
              ? `Exercise: ${courseItems[index - 1].data.title}`
              : 'Final Exam'}
          </p>
          <p className="text-xs text-gray-500">
            {item.type === 'subtitle' ? item.data.duration : `5 mins`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
