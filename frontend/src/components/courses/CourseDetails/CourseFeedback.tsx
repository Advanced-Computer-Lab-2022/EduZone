import { getCookie } from 'cookies-next';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import RatingBox from '../RatingBox';

declare type CourseFeedbackProps = {
  updateCourse: (course: any) => void;
  courseId: string;
  review: string;
  rating: number;
};

const CourseFeedback: React.FC<CourseFeedbackProps> = ({
  updateCourse,
  courseId,
  review,
  rating,
}) => {
  const [openReview, setOpenReview] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const rateCourse = async (rating: number) => {
    try {
      const res = await axios({
        url: '/courses/' + courseId + '/rate',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          rating,
        },
      });
      updateCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const reviewCourse = async (review: string) => {
    try {
      const res = await axios({
        url: '/courses/' + courseId + '/review',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          review,
        },
      });
      updateCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async () => {
    try {
      const res = await axios({
        url: '/courses/' + courseId + '/review',
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
      });
      updateCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
      <p className="text-xl text-center">Give us your feedback!</p>
      <div className="flex justify-between">
        <p>Rate this course: </p>
        <RatingBox rating={rating} onClick={rateCourse} />
      </div>
      <div>
        <div>
          {review === '' ? (
            <p
              className="text-sm text-right -mt-3 text-primary hover:underline cursor-pointer"
              onClick={() => setOpenReview((s) => !s)}
            >
              {openReview ? 'Cancel' : 'Write a review'}
            </p>
          ) : (
            <div>
              <span className="font-medium">Your review: </span>
              {!openReview && (
                <span className="ml-1 text-sm text-gray-500 hover:underline cursor-pointer grow">
                  {review}
                </span>
              )}
              <div className="flex items-center justify-between">
                <p
                  className="text-sm text-left  text-red-600 hover:underline cursor-pointer"
                  onClick={() => deleteReview()}
                >
                  Delete Review
                </p>
                <p
                  className="text-sm text-right  text-primary hover:underline cursor-pointer"
                  onClick={() => setOpenReview((s) => !s)}
                >
                  {openReview ? 'Cancel' : 'Edit your review'}
                </p>
              </div>
            </div>
          )}
        </div>
        {openReview && (
          <form
            className="text-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const review = formData.get('review');
              if (review) {
                reviewCourse(review as string);
              }
              setOpenReview(false);
            }}
          >
            <textarea
              className="w-full border border-gray-300 rounded-md p-4"
              name="review"
              id=""
              cols={30}
              rows={3}
              placeholder="Write your review here"
              defaultValue={review}
            ></textarea>
            <button className="w-full bg-primary text-white rounded-md py-2 mt-2">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseFeedback;
