import { AxiosResponse } from 'axios';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../../components/layout/common/navbar/ProfileMenu/Avatar';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { Course } from '../../../types/entities/Course';
import { Subtitle } from '../../../types/entities/Subtitle';
import { axios, calculateCourseRating } from '../../../utils';
import YouTube, { YouTubeProps } from 'react-youtube';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import IconText from '../../../components/common/IconText';
import { MdEditNote } from 'react-icons/md';
import { getCookie } from 'cookies-next';
import RatingBox from '../../../components/courses/RatingBox';
import Modal from '../../../components/common/Modal';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import calculateRatingFunc from '../../../utils/rating';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [withPromotion, setWithPromotion] = useState(false);
  const [addPromotionOpen, setAddPromotionOpen] = useState(false);
  const [rating, setRating] = useState(undefined as number | undefined);
  const [openReview, setOpenReview] = useState(false);
  const [review, setReview] = useState('');
  const [instructorRating, setInstructorRating] = useState(-1);
  const [totalInstructorRating, setTotalInstructorRating] = useState(-1);
  const [instructorReview, setInstructorReview] = useState('');
  const [openInstructorProfile, setOpenInstructorProfile] = useState(false);
  const [paymentToken, setPaymentToken] = useState(
    undefined as Token | undefined
  );
  const [promotionExpiryDate, setPromotionExpiryDate] = useState(
    null as Date | null
  );
  const navigate = useNavigate();
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    width: (235 * 16) / 9,
    height: '235',
    playerVars: {
      autoplay: 0,
      muted: 0,
    },
  };

  const calculateRating = () => {
    const { total, rating } = calculateCourseRating(course);

    if (total === 0) setRating(undefined);
    else setRating(rating);
  };

  const onBuyCourse = async (token: Token) => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id + '/buy',
        data: {
          paymentId: token.id,
        },
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
      });
      console.log(res.data);
      if (res.status === 200) {
        navigate('/courses/' + id + '/learning');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
        method: 'GET',
      });
      setCourse(res.data);
      setWithPromotion(
        (res.data.discount &&
          new Date(res.data.discount.validUntil) >= new Date()) ||
          false
      );
      setPromotionExpiryDate(
        new Date(res.data?.discount?.validUntil || new Date())
      );

      // setRating(
      //   res.data.enrolled?.reduce(
      //     (acc: any, curr: any) => (acc + curr.rating || 0) / 2,
      //     0
      //   )
      // );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  const rateCourse = async (rating: number) => {
    try {
      const res = await axios({
        url: '/courses/' + id + '/rate',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          rating,
        },
      });
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const rateInstructor = async (rating: number) => {
    try {
      const res = await axios({
        url: '/users/' + course?.instructor?._id + '/rate',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          rating,
        },
      });
      setCourse({ ...course, instructor: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  const reviewInstructor = async (review: string) => {
    try {
      const res = await axios({
        url: '/users/' + course?.instructor?._id + '/review',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          review,
        },
      });
      setCourse({ ...course, instructor: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  const reviewCourse = async (review: string) => {
    try {
      const res = await axios({
        url: '/courses/' + id + '/review',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
        data: {
          review,
        },
      });
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!course) getCourse();
    setWithPromotion(
      (course?.discount &&
        new Date(course?.discount.validUntil) >= new Date()) ||
        false
    );
    setPromotionExpiryDate(
      new Date(course?.discount?.validUntil || new Date())
    );
    setReview(
      course?.enrolled?.find((s: any) => s.studentId === user.id)?.review || ''
    );
    setInstructorRating(
      course?.instructor?.feedback?.find((s: any) => s.student === user.id)
        ?.rating || 0
    );
    setInstructorReview(
      course?.instructor?.feedback?.find((s: any) => s.student === user.id)
        ?.review || ''
    );

    calculateRating();
    console.log(rating);
  }, [course]);

  const handleToken = (token: Token) => {
    console.log(token);
    setPaymentToken(token);
  };
  return (
    <Layout>
      <Modal
        open={openInstructorProfile}
        title={course?.instructor?.name}
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

      <div className="grid grid-cols-3 gap-6 my-4 ">
        <div className="col-span-2">
          <div className=" justify-between items-center">
            <p className="text-4xl font-medium">{course?.title}</p>
            <p className="text-sm text-gray-500">
              Rating: {rating || 'No Rating yet'}
            </p>
          </div>
          <div
            className="flex items-center py-2 group cursor-pointer w-fit"
            onClick={() =>
              course?.enrolled.find((s: any) => s.studentId === user.id) &&
              setOpenInstructorProfile(true)
            }
          >
            <div className="group-hover:border-blue-500 border-2 border-white rounded-full">
              <Avatar
                name={course?.instructor?.name || ''}
                img={course?.instructor?.img}
              />
            </div>
            <div className="ml-2 flex flex-col">
              <p className="text-lg font-medium group-hover:text-blue-500 text-gray-700">
                {course?.instructor?.name}
              </p>
              <p className="text-sm font-medium group-hover:font-semibold -mt-1 text-gray-500">
                Instructor
              </p>
            </div>
          </div>
          {/* <div>
            <p className="text-sm text-primary" onClick={() => ''}>
              Rate the instructor
            </p>
            <div className="">
              <RatingBox
                fixed={false}
                rating={instructorRating}
                onClick={() => ''}
              />
            </div>
          </div> */}
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
                    <p className="text-sm text-gray-500">
                      {section.duration} Hrs
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Instructor */}
        </div>
        <div className=" space-y-4 w-full">
          {course?.enrolled.find((s: any) => s.studentId === user.id) && (
            <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
              <p className="text-xl text-center">
                You are enrolled in this course
              </p>

              <div>
                <p className="text-lg font-medium">Course Progress</p>
              </div>
            </div>
          )}
          <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
            {/* <img
                src={course?.thumbnail}
                alt=""
                className="overflow-hidden rounded-md"
              /> */}
            <div className="w-full overflow-hidden bg-gray-100 rounded-md flex items-center">
              <YouTube
                videoId={course?.preview_video?.split('v=')[1]}
                opts={opts}
                onReady={onPlayerReady}
              />
            </div>

            <div>
              <p className="text-lg font-medium">{course?.title}</p>
              <p className="text-sm text-gray-500">
                Rating: {rating || 'No Rating yet'}
              </p>
            </div>

            <p className="text-3xl text-primary font-semibold">
              {course &&
                Number(
                  course?.price *
                    (withPromotion
                      ? 1 - (course?.discount?.amount ?? 0) / 100
                      : 1) *
                    conversion_rate
                ).toFixed(2)}{' '}
              {currency}
            </p>

            <div>
              {course?.enrolled.find((s: any) => s.studentId === user.id) ? (
                <Link to={`learning`}>
                  <button className="w-full bg-primary text-white  py-2 rounded-md">
                    Start Learning
                  </button>
                </Link>
              ) : (
                <div className=" w-full space-y-2">
                  <StripeCheckout
                    stripeKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
                    token={onBuyCourse}
                    name=""
                    panelLabel={`Pay`}
                    currency="USD"
                    amount={course?.price * 100}
                    ComponentClass="div"
                  >
                    <button className="w-full bg-primary text-white rounded-md py-2">
                      Buy Now
                    </button>
                  </StripeCheckout>

                  <button className="w-full border border-primary text-primary rounded-md py-2 hover:text-white hover:bg-primary">
                    Add to Wishlist
                  </button>
                </div>
              )}
            </div>
          </div>
          {course?.enrolled.find((s: any) => s.studentId === user.id) && (
            <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
              <p className="text-xl text-center">Give us your feedback!</p>
              <div className="flex justify-between">
                <p>Rate this course: </p>
                <RatingBox
                  rating={
                    course?.enrolled.find((s: any) => s.studentId === user.id)
                      .rating || -1
                  }
                  onClick={rateCourse}
                />
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
                        <span className="text-sm text-gray-500 hover:underline cursor-pointer">
                          {review}
                        </span>
                      )}
                      <p
                        className="text-sm text-right  text-primary hover:underline cursor-pointer"
                        onClick={() => setOpenReview((s) => !s)}
                      >
                        {openReview ? 'Cancel' : 'Edit your review'}
                      </p>
                    </div>
                  )}
                </div>
                {openReview && (
                  <form
                    className="text-gray-800"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SingleCourse;
