import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { axios } from '../../../utils';
import { getCookie } from 'cookies-next';
declare type CourseProgressProps = {
  progress: number;
  failed: boolean;
  courseId: string;
  enrollmentStatus: string;
  onUpdateCourse: (course: any) => void;
};

const CourseProgress: React.FC<CourseProgressProps> = ({
  progress,
  failed,
  courseId,
  enrollmentStatus,
  onUpdateCourse,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const requestRefund = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to request a refund?'
    );
    if (confirmed) {
      const res = await axios({
        url: `/courses/${courseId}/refund`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
        data: {},
      });
      console.log(res.data);
      onUpdateCourse(res.data);
      if (pathname.includes('learning')) navigate(`/courses/${courseId}`);
    }
    console.log('request refund', confirmed);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 space-y-3">
      {/* <p className="text-xl text-center">You are enrolled in this course</p> */}
      <div className={'flex  items-center justify-between'}>
        <p>
          Progress:{' '}
          <span
            className={` font-medium ${
              (Number.isNaN(progress) ? 0 : progress) === 100
                ? failed
                  ? 'text-red-600'
                  : 'text-green-600'
                : ''
            }`}
          >
            {(Number.isNaN(progress) ? 0 : progress) < 100
              ? (Number.isNaN(progress) ? 0 : Number(progress).toFixed(1)) + '%'
              : failed
              ? 'Failed Final'
              : 'Done'}
          </span>
        </p>
        {(Number.isNaN(progress) ? 0 : progress) === 100 && !failed && (
          <Link to={`/courses/${courseId}/certificate`}>
            <p className="ml-2 text-gray-500 flex gap-2 hover:text-primary ">
              Get your certificate
              <TbCertificate size={20} />
            </p>
          </Link>
        )}
        {enrollmentStatus === 'blocked' ? (
          <p className="ml-2 text-gray-500 flex gap-2 hover:text-primary ">
            Pending refund...
          </p>
        ) : // (Number.isNaN(progress) ? 0 : progress) < 50 && (
        //   <button
        //     className="ml-2 text-gray-500 flex gap-2 hover:text-primary "
        //     onClick={requestRefund}
        //   >
        //     Request a refund
        //     <HiOutlineReceiptRefund size={20} />
        //   </button>
        // )
        null}
      </div>
      <div className="flex items-center gap-3 ">
        <div className="grow bg-gray-300 h-2 rounded-full ">
          <div
            className="bg-primary h-full rounded-full duration-200"
            style={{ width: `${Number.isNaN(progress) ? 0 : progress}%` }}
          ></div>
        </div>
        <FaTrophy
          className={`${
            (Number.isNaN(progress) ? 0 : progress) < 100
              ? 'text-gray-400'
              : 'text-primary'
          }`}
          size={20}
        />
      </div>
    </div>
  );
};

export default CourseProgress;
