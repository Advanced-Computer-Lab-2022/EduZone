import React from 'react';
import { Link } from 'react-router-dom';

declare type LearningHeaderProps = {
  onMarkCompleted: (
    item: 'exercise' | 'subtitle' | 'finalExam',
    itemId: string
  ) => void;
  courseItems: any[];
  currentCourseItem: number;
  enrolled: any;
  title: string;
  courseId: string;
};

const LearningHeader: React.FC<LearningHeaderProps> = ({
  onMarkCompleted,
  courseItems,
  currentCourseItem,
  enrolled,
  title,
  courseId,
}) => {
  return (
    <div className="flex items-center justify-between ">
      <div>
        <span className="text-2xl font-medium">
          {courseItems[currentCourseItem - 1]?.type === 'subtitle'
            ? courseItems[currentCourseItem - 1]?.data.title
            : `Exercise: ${courseItems[currentCourseItem - 2]?.data.title}`}
        </span>
        <Link to={'/courses/' + courseId}>
          <p className="text-gray-600 font-medium -mt-1 hover:text-primary">
            {title}
          </p>
        </Link>
      </div>
      {courseItems[currentCourseItem - 1]?.type === 'subtitle' &&
        !enrolled?.completed?.subtitles?.includes(
          courseItems[currentCourseItem - 1]?.data._id
        ) && (
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 text-white bg-green-600 rounded-md"
              onClick={() => {
                onMarkCompleted(
                  courseItems[currentCourseItem - 1]?.type,
                  courseItems[currentCourseItem - 1]?.data._id
                );
              }}
            >
              Mark as Completed
            </button>
          </div>
        )}
    </div>
  );
};

export default LearningHeader;
