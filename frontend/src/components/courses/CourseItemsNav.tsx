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
import { Link, useParams } from 'react-router-dom';
import IconText from '../common/IconText';
import CourseItem from './CourseItem';

declare type CourseItemsNavProps = {
  nextItem: () => void;
  prevItem: () => void;
  courseItems: any[];
  currentCourseItem: number;
  onClickItem: (index: number) => void;
  enrolled: any;
  progress: number;
};

const CourseItemsNav: React.FC<CourseItemsNavProps> = ({
  nextItem,
  prevItem,
  courseItems,
  currentCourseItem,
  onClickItem,
  enrolled,
  progress = 0,
}) => {
  const [failed, setFailed] = useState(
    enrolled?.finalExam?.score < 50 ? true : false
  );
  const isCompleted = (
    item: 'exercise' | 'subtitle' | 'finalExam',
    itemId: string
  ): boolean => {
    console;
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
        <div className="bg-white p-4 rounded-md shadow-md space-y-2 text-sm  mb-2">
          <div className={'flex  items-center justify-between'}>
            <p>
              Progress:{' '}
              <span
                className={` font-medium ${
                  progress === 100
                    ? failed
                      ? 'text-red-600'
                      : 'text-green-600'
                    : ''
                }`}
              >
                {progress < 100
                  ? progress + '%'
                  : failed
                  ? 'Failed Final'
                  : 'Done'}
              </span>
            </p>
            {progress === 100 && !failed && (
              <Link to={`/courses/${courseId}/certificate`}>
                <p className="ml-2 text-gray-500 flex gap-2 hover:text-primary ">
                  Get your certificate
                  <TbCertificate size={20} />
                </p>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 ">
            <div className="grow bg-gray-300 h-2 rounded-full ">
              <div
                className="bg-primary h-full rounded-full duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <FaTrophy
              className={`${progress < 100 ? 'text-gray-400' : 'text-primary'}`}
              size={20}
            />
          </div>
        </div>
        <div className="flex justify-between -mx-4 ">
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
