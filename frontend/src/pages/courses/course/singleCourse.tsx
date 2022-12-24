import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { Subtitle } from '../../../types/entities/Subtitle';
import { axios, calculateCourseRating } from '../../../utils';
import YouTube, { YouTubeProps } from 'react-youtube';
import 'react-datepicker/dist/react-datepicker.css';
import { getCookie } from 'cookies-next';
import RatingBox from '../../../components/courses/RatingBox';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import { TbCertificate } from 'react-icons/tb';
import InstructorDetails from '../../../components/courses/CourseDetails/InstructorDetails';
import CourseHeader from '../../../components/courses/CourseDetails/CourseHeader';
import CourseSummary from '../../../components/courses/CourseDetails/CourseSummary';
import CourseProgress from '../../../components/courses/CourseDetails/CourseProgress';
import DisplayRating from '../../../components/courses/DisplayRating';
import CourseFeedback from '../../../components/courses/CourseDetails/CourseFeedback';
import { showMessage } from '../../../redux/features/ui.reducer';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [rating, setRating] = useState(undefined as number | undefined);

  const [review, setReview] = useState('');
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
  const [discount, setDiscount] = useState({} as any);
  const [progress, setProgress] = useState(0);
  const [courseItems, setCourseItems] = useState([] as any[]);
  const [failed, setFailed] = useState(false);
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
        method: 'GET',
      });
      setCourse(res.data);

      setPromotionExpiryDate(
        new Date(res.data?.discount?.validUntil || new Date())
      );
      setDiscount({
        ...res.data?.discount,
        valid:
          res.data?.discount &&
          res.data?.discount?.validFrom < new Date() &&
          res.data?.discount?.validUntil > new Date(),
      });

      setCourseItems([]);
      res.data.subtitles.map((s: Subtitle) => {
        setCourseItems((prev) => [
          ...prev,
          {
            type: 'subtitle',
            data: s,
          },
        ]);
        if (s.exercise) {
          setCourseItems((prev) => [
            ...prev,
            {
              type: 'exercise',
              data: s.exercise,
            },
          ]);
        }
      });
      if (res.data?.finalExam) {
        setCourseItems((prev) => [
          ...prev,
          {
            type: 'finalExam',
            data: res.data.finalExam,
          },
        ]);
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  const updateCourseInstructor = async (instructor: any) => {
    setCourse({ ...course, instructor });
  };

  const updateCourse = (course: any) => {
    setCourse(course);
  };

  useEffect(() => {
    if (!course) getCourse();
    setPromotionExpiryDate(
      new Date(course?.discount?.validUntil || new Date())
    );
    setReview(
      course?.enrolled?.find((s: any) => s.studentId === user.id)?.review || ''
    );

    setProgress(
      ((course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.completed
        ?.exercises?.length +
        course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.completed
          ?.subtitles?.length +
        (course?.enrolled?.find((e: any) => e?.studentId === user?.id)
          ?.completed?.finalExam
          ? 1
          : 0)) /
        courseItems.length) *
        100
    );
    setFailed(
      course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.finalExam
        ?.score < 50
        ? true
        : false
    );

    setDiscount({
      ...course?.discount,
      valid:
        course?.discount &&
        course?.discount?.validFrom < new Date() &&
        course?.discount?.validUntil > new Date(),
    });

    calculateRating();
    console.log(rating);
  }, [course]);

  const handleToken = (token: Token) => {
    console.log(token);
    setPaymentToken(token);
  };

  const onUpdateCourse = (course: any) => {
    setCourse(course);
  };

  const cancelRefundRequest = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel the refund request?'
    );
    if (confirmed) {
      const res = await axios({
        url: `/courses/${course?._id}/refund`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
        data: {},
      });
      console.log(res.data);
      onUpdateCourse(res.data);
    }
    console.log('request refund', confirmed);
  };

  const dispatch = useDispatch();

  const requestCourseAccess = async () => {
    try {
      const res = await axios({
        url: `/courses/${course?._id}/request-access`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
        data: {},
      });
      console.log(res.data);
      onUpdateCourse(res.data);
      if (res.status === 201) {
        dispatch(showMessage({ text: 'Request sent', type: 'success' }));
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        dispatch(
          showMessage({ text: error.response?.data.error, type: 'error' })
        );
      } else {
        dispatch(
          showMessage({ text: (error as Error).message, type: 'error' })
        );
      }
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-6 my-4 ">
        <div className="col-span-2">
          <CourseHeader title={course?.title ?? ''} rating={rating} />
          <InstructorDetails
            instructor={course?.instructor}
            enrolled={course?.enrolled}
            updateCourseInstructor={updateCourseInstructor}
          />
          <CourseSummary course={course} />
        </div>
        <div className=" space-y-4 w-full">
          {course?.enrolled.find((s: any) => s.studentId === user.id) &&
            course?.enrolled.find((s: any) => s.studentId === user.id)
              .status === 'active' && (
              <CourseProgress
                progress={progress}
                failed={failed}
                courseId={course?._id}
                enrollmentStatus={
                  course?.enrolled.find((s: any) => s.studentId === user.id)
                    .status
                }
                onUpdateCourse={onUpdateCourse}
              />
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
                {rating ? (
                  <DisplayRating rating={rating ?? 0} />
                ) : (
                  'No Rating yet'
                )}
              </p>
            </div>

            <p className="text-3xl text-primary font-semibold">
              {course && discount.valid
                ? Number(
                    course?.price *
                      (1 - (course?.discount?.amount ?? 0) / 100) *
                      conversion_rate
                  ).toFixed(2)
                : Number(course?.price * conversion_rate).toFixed(2)}{' '}
              {currency}
            </p>

            <div>
              {course?.enrolled.find((s: any) => s.studentId === user.id) &&
              course?.enrolled.find((s: any) => s.studentId === user.id)
                ?.status === 'active' ? (
                <Link to={`learning`}>
                  <button className="w-full bg-primary text-white  py-2 rounded-md">
                    Start Learning
                  </button>
                </Link>
              ) : course?.enrolled.find((s: any) => s.studentId === user.id)
                  ?.status === 'blocked' ? (
                <div className="w-full flex justify-between px-4">
                  <p className=" text-gray-500 rounded-md py-2">
                    Processing your refund
                  </p>
                  <button
                    className="text-primary"
                    onClick={() => cancelRefundRequest()}
                  >
                    Cancel Request
                  </button>
                </div>
              ) : (
                <div className=" w-full space-y-2">
                  {user.role === 'corp_trainee' ? (
                    <button
                      className="w-full bg-primary text-white rounded-md py-2"
                      onClick={() => requestCourseAccess()}
                    >
                      Request Access
                    </button>
                  ) : (
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
                  )}
                </div>
              )}
            </div>
          </div>
          {course?.enrolled.find((s: any) => s.studentId === user.id) &&
            course?.enrolled.find((s: any) => s.studentId === user.id)
              .status === 'active' && (
              <CourseFeedback
                updateCourse={updateCourse}
                courseId={course?._id}
                review={review}
                rating={
                  course?.enrolled.find((s: any) => s.studentId === user.id)
                    .rating || -1
                }
              />
            )}
        </div>
      </div>
    </Layout>
  );
};

export default SingleCourse;
