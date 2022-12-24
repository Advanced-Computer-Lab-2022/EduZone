import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import Modal from '../../common/Modal';
import Avatar from '../../layout/common/navbar/ProfileMenu/Avatar';
import RatingBox from '../RatingBox';

const InstructorDetails: React.FC<{
  instructor: any;
  enrolled: any;
  updateCourseInstructor: (instructor: any) => void;
}> = ({ instructor, enrolled, updateCourseInstructor }) => {
  const [instructorRating, setInstructorRating] = useState(-1);
  const [totalInstructorRating, setTotalInstructorRating] = useState(-1);
  const [instructorReview, setInstructorReview] = useState('');
  const [openInstructorProfile, setOpenInstructorProfile] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    setInstructorRating(
      instructor?.feedback?.find((s: any) => s.student === user.id)?.rating || 0
    );
    setInstructorReview(
      instructor?.feedback?.find((s: any) => s.student === user.id)?.review ||
        ''
    );
  }, []);
  const reviewInstructor = async (review: string) => {
    try {
      const res = await axios({
        url: '/users/' + instructor?._id + '/review',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          review,
        },
      });
      updateCourseInstructor(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const rateInstructor = async (rating: number) => {
    try {
      const res = await axios({
        url: '/users/' + instructor?._id + '/rate',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          rating,
        },
      });
      updateCourseInstructor(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        open={openInstructorProfile}
        title={instructor?.name}
        close={() => setOpenInstructorProfile(false)}
      >
        <div className="flex flex-col  ">
          <div className="flex gap-4 items-center">
            <p>Rate instructor</p>
            <RatingBox
              fixed={false}
              rating={instructorRating}
              onClick={rateInstructor}
            />
          </div>
          <div className="mt-4">
            <p>Review instructor</p>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-2"
              value={instructorReview}
              onChange={(e) => setInstructorReview(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 text- px-4 py-2 rounded-md"
                onClick={() => {
                  setOpenInstructorProfile(false);
                  setInstructorReview('');
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                  if (instructorReview !== '')
                    await reviewInstructor(instructorReview);
                  setOpenInstructorProfile(false);
                  setInstructorReview('');
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className="flex items-center py-2 group cursor-pointer w-fit"
        onClick={() =>
          enrolled.find((s: any) => s.studentId === user.id) &&
          setOpenInstructorProfile(true)
        }
      >
        <div className="group-hover:border-blue-500 border-2 border-white rounded-full">
          <Avatar name={instructor?.name || ''} img={instructor?.img} />
        </div>
        <div className="ml-2 flex flex-col">
          <p className="text-lg font-medium group-hover:text-blue-500 text-gray-700">
            {instructor?.name}
          </p>
          <p className="text-sm font-medium group-hover:font-semibold -mt-1 text-gray-500">
            Instructor
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
