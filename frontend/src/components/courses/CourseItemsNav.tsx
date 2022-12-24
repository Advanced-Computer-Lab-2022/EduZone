import React, { useState } from 'react';
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsPlayFill,
  BsPencilSquare,
  BsFileEarmarkText,
} from 'react-icons/bs';
import { FaTrophy } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import IconText from '../common/IconText';
import CourseProgress from './CourseDetails/CourseProgress';
import CourseItem from './CourseItem';

declare type CourseItemsNavProps = {
  nextItem: () => void;
  prevItem: () => void;
  courseItems: any[];
  currentCourseItem: number;
  onClickItem: (index: number) => void;
  enrolled: any;
  progress: number;
  onUpdateCourse: (course: any) => void;
};

const CourseItemsNav: React.FC<CourseItemsNavProps> = ({
  nextItem,
  prevItem,
  courseItems,
  currentCourseItem,
  onClickItem,
  enrolled,
  progress = 0,
  onUpdateCourse,
}) => {
  const [failed, setFailed] = useState(
    enrolled?.finalExam?.score < 50 ? true : false
  );
  const { user } = useSelector((state: RootState) => state.auth);
  console.log('progress', Number.isNaN(progress) ? 0 : progress);
  const isCompleted = (
    item: 'exercise' | 'subtitle' | 'finalExam',
    itemId: string
  ): boolean => {
    if (enrolled) {
      if (item === 'exercise') {
        return enrolled?.completed?.exercises?.includes(itemId);
      }
      if (item === 'subtitle') {
        return enrolled?.completed?.subtitles?.includes(itemId);
      }
      if (item === 'finalExam') {
        return enrolled?.completed?.finalExam;
      }
    }
    return false;
  };

  const { id: courseId } = useParams<{ id: string }>();
  return (
    <div>
      <div className="flex flex-col mt-4">
        {enrolled && enrolled.status === 'active' && (
          <CourseProgress
            progress={progress}
            failed={failed}
            courseId={courseId ?? ''}
            enrollmentStatus={enrolled ? enrolled?.status : 'blocked'}
            onUpdateCourse={onUpdateCourse}
          />
        )}
        <div className="flex justify-between -mx-4 mt-2">
          <button className="cursor-pointer hover:text-primary">
            <IconText
              text={'Previous'}
              leading={<BsArrowLeftShort size={25} />}
              onClick={() => prevItem()}
            />
          </button>
          <button className="cursor-pointer hover:text-primary">
            <IconText
              text={'Next'}
              trailing={<BsArrowRightShort size={25} />}
              onClick={() => nextItem()}
            />
          </button>
        </div>

        {courseItems?.map((item, index: number) => (
          <CourseItem
            key={index}
            index={index}
            courseItems={courseItems}
            currentCourseItem={currentCourseItem}
            onClickItem={onClickItem}
            item={item}
            completed={isCompleted(item.type, item.data._id)}
            score={
              enrolled?.exercises?.find(
                (exercise: any) => exercise.exerciseId === item.data._id
              )?.score ||
              enrolled?.finalExam?.score ||
              -1
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CourseItemsNav;
