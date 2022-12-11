import { AxiosResponse } from 'axios';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdEditNote } from 'react-icons/md';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import Avatar from '../../../components/layout/navbar/common/ProfileMenu/Avatar';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { Subtitle } from '../../../types/entities/Subtitle';
import { axios } from '../../../utils';
import IconText from '../../../components/common/IconText';
import RatingBox from '../../../components/courses/RatingBox';
const InstructorSingleCourse = () => {
  const { courseId, instructorId } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [withPromotion, setWithPromotion] = useState(false);
  const [addPromotionOpen, setAddPromotionOpen] = useState(false);
  const [openViewReviews, setOpenViewReviews] = useState(false);
  const navigate = useNavigate();
  const [promotionExpiryDate, setPromotionExpiryDate] = useState(
    null as Date | null
  );
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '250',
    width: '450',
    playerVars: {
      autoplay: 0,
      muted: 0,
    },
  };
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + courseId,
        method: 'GET',
      });
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [rating, setRating] = useState(undefined as number | undefined);
  const { user } = useSelector((state: RootState) => state.auth);
  const calculateRating = () => {
    let total = 0;
    let sum = 0;
    course?.enrolled?.map((s: any) => {
      if (s.rating) {
        sum += s.rating;
        total++;
      }
    });

    if (total === 0) setRating(undefined);
    else setRating(sum / total);
  };
  const onAddPromotion: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + courseId,
        method: 'PATCH',
        data: {
          discount: {
            amount: data.amount,
            validUntil: promotionExpiryDate,
          },
        },
      });
      setCourse({
        ...res.data,
        discount: { amount: data.amount, validUntil: promotionExpiryDate },
      });
      setAddPromotionOpen(false);
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
    calculateRating();
  }, [course]);
  return (
    <AdminLayout>
      <div className="my-4 space-y-4  max-w-[90%] mx-auto">
        <div className="flex justify-between items-center">
          <p className="text-3xl font-medium">{course?.title}</p>
          {user.id === course?.instructor?._id && (
            <Link
              to={`/courses/${course?._id}/edit`}
              className=" bg-primary text-white rounded-md"
            >
              <IconText
                text={'Edit Course'}
                leading={<MdEditNote size={20} />}
              />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="mt-2 flex items-center py-2">
              <Avatar name={course?.instructor?.name || ''} />
              <div className="ml-2">
                <p className="text-lg font-medium">
                  {course?.instructor?.name}
                </p>
              </div>
            </div>
            <p className="text-gray-400 font-bold">
              Duration ≈{' '}
              {course?.subtitles &&
                Math.ceil(
                  course?.subtitles?.reduce(
                    (acc: any, curr: any) => acc + curr.duration,
                    0
                  )
                )}{' '}
              hours
            </p>
            <div className="mt-4">
              <p className="text-2xl font-medium my-2">Summary</p>
              <hr />
              <p className="mt-2">{course?.summary}</p>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-medium my-2">Course Sections</p>
              <hr />
              <div className="">
                {course?.subtitles?.map(
                  (section: Subtitle & { _id: any }, index: number) => (
                    <div
                      className=" hover:bg-gray-200 p-2 cursor-pointer"
                      key={index}
                      onClick={() => navigate(`subtitles/${section._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium">{section.title}</p>
                        <p className="text-sm text-gray-500">
                          {section.duration} Hrs
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
            {/* Instructor */}
          </div>
          <div className=" space-y-4 ">
            <div>
              <div className=" bg-gray-300 rounded-md flex justify-center items-center overflow-hidden">
                {
                  <YouTube
                    videoId={course?.preview_video?.split('v=')[1]}
                    opts={opts}
                    onReady={onPlayerReady}
                  />
                }
              </div>
            </div>
            {user.id === course?.instructor?._id && (
              <div className="flex flex-col justify-between items-center bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
                {course?.finalExam && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-lg font-medium">Final Exam</p>
                    <p className="text-sm text-gray-500">
                      {course?.finalExam?.questions?.length} Questions
                    </p>
                  </div>
                )}
                <div className="w-full">
                  <Link
                    to={`/instructor/${instructorId}/courses/${courseId}/exam`}
                  >
                    <button className="bg-blue-500 text-white w-full py-2 rounded-md">
                      {course?.finalExam ? 'Edit Final Exam' : 'Add Final Exam'}
                    </button>
                  </Link>
                </div>
              </div>
            )}
            <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
              {/* <img
                src={course?.thumbnail}
                alt=""
                className="overflow-hidden rounded-md"
              /> */}
              <p className="text-xl font-medium">{course?.title}</p>
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
              {user.id !== course?.instructor?._id ? (
                <div className=" w-full space-y-2">
                  <button className="w-full bg-primary text-white rounded-md py-2">
                    Buy Now
                  </button>
                  <button className="w-full border border-primary text-primary rounded-md py-2 hover:text-white hover:bg-primary">
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div className=" w-full space-y-2">
                  <p>
                    {withPromotion ? (
                      <div>
                        <p>
                          Promotion:
                          <span className="text-green-700"> Active </span> -
                          <span className="font-medium">
                            {' '}
                            {course?.discount?.amount}% off{' '}
                          </span>
                        </p>
                        <span className="text-gray-500">
                          Valid until{' '}
                          {new Date(
                            course?.discount?.validUntil || ''
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div>
                        Promotion:
                        <span className="text-red-700">Inactive</span>
                      </div>
                    )}
                  </p>
                  {!addPromotionOpen && (
                    <button
                      className="w-full bg-primary text-white rounded-md py-2"
                      onClick={() => setAddPromotionOpen(true)}
                    >
                      {withPromotion ? 'Edit Promotion' : 'Add Promotion'}
                    </button>
                  )}
                  {addPromotionOpen && (
                    <form onSubmit={onAddPromotion}>
                      <label htmlFor="amount">Discount Amount</label>
                      <input
                        type="number"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary outline-primary block w-full p-3 mb-3"
                        placeholder="Discount Amount"
                        name="amount"
                        min={0}
                        max={100}
                        required
                      />
                      <label htmlFor="validUntil">Valid Until</label>
                      <DatePicker
                        name="validUntil"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary outline-primary block w-full p-3 mb-3"
                        selected={promotionExpiryDate}
                        onChange={(date: Date) => setPromotionExpiryDate(date)}
                        required
                        minDate={new Date()}
                      />

                      <button className="w-full bg-primary text-white rounded-md py-2 mb-2">
                        Save
                      </button>
                      <div
                        className="text-center w-full cursor-pointer bg-gray-400 text-white rounded-md py-2"
                        onClick={() => setAddPromotionOpen(false)}
                      >
                        Cancel
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
                <p className="text-xl font-medium">Course Reviews</p>
                <div className="text text-gray-500 flex justify-between">
                  <span> Rating: </span>
                  <span>
                    {rating ? (
                      <div className="flex items-center gap-2">
                        <RatingBox
                          fixed={true}
                          rating={rating}
                          onClick={() => ''}
                        />
                        <span className="">{rating}</span>
                      </div>
                    ) : (
                      'No Reviews'
                    )}
                  </span>
                </div>
                <div className="text text-gray-500 flex flex-col justify-between ">
                  <div className="flex justify-between">
                    <p>
                      Total Reviews:{' '}
                      <span className="font-medium">
                        {
                          course?.enrolled?.filter(
                            (s: any) => s.review !== undefined
                          ).length
                        }
                      </span>
                    </p>
                    <span
                      className="text-primary text-sm hover:underline cursor-pointer"
                      onClick={() => {
                        setOpenViewReviews((s) => !s);
                      }}
                    >
                      {openViewReviews ? 'Close' : 'View All'}
                    </span>
                  </div>
                  <div>
                    {openViewReviews && (
                      <div className="w-full pl-4">
                        {course?.enrolled?.map((s: any) => {
                          if (s.review) {
                            return (
                              <li className="text-sm text-gray-500">
                                {s.review}
                              </li>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorSingleCourse;
