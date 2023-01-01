import { getCookie } from 'cookies-next';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { MdOutlineReport } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { axios } from '../../../utils';
import Modal from '../../common/Modal';

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
  useEffect(() => {
    if (
      courseItems[currentCourseItem - 1]?.type === 'subtitle' &&
      !enrolled?.completed?.subtitles?.includes(
        courseItems[currentCourseItem - 1]?.data._id
      )
    ) {
      onMarkCompleted(
        courseItems[currentCourseItem - 1]?.type,
        courseItems[currentCourseItem - 1]?.data._id
      );
    }
  }, [courseItems, currentCourseItem]);
  const [openModal, setOpenModal] = useState(false);

  const reportProblem: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const res = await axios({
      url: `/courses/${courseId}/problems`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        problem: {
          type: formData.get('problem'),
          description: formData.get('description'),
        },
      },
    });
    if (res.status === 201) {
      setOpenModal(false);
    }
  };
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
      {/* {courseItems[currentCourseItem - 1]?.type === 'subtitle' &&
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
        )} */}
      <div>
        <div
          className="text-gray-500 flex items-center text-sm cursor-pointer hover:underline"
          onClick={() => setOpenModal(true)}
        >
          <p>Report problem</p>
        </div>
      </div>
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={'Report Problem'}
      >
        <form className="px-3" onSubmit={reportProblem}>
          <label htmlFor="problem">Problem</label>
          <select
            name="problem"
            id="problem"
            className="w-full p-2 px-4 border rounded-md mb-3"
          >
            <option value="" disabled selected>
              Select a problem
            </option>
            <option value="technical">Technical</option>
            <option value="financial">Financial</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="description" className="mt-2">
            Description
          </label>
          <textarea
            name="description"
            id=""
            cols={30}
            rows={5}
            className="w-full p-4 border rounded-md"
            placeholder="Description of the problem"
          ></textarea>
          <div className="w-full flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded-md mt-4 ">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LearningHeader;
