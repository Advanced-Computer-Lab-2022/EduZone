import { AxiosResponse } from 'axios';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../components/layout/navbar/common/ProfileMenu/Avatar';
import Layout from '../../components/layout/Trainee/Layout';
import { RootState } from '../../redux/store';
import { Course } from '../../types/entities/Course';
import { Subtitle } from '../../types/entities/Subtitle';
import { axios } from '../../utils';
import YouTube, { YouTubeProps } from 'react-youtube';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as Course | undefined);
  const [withPromotion, setWithPromotion] = useState(false);
  const [addPromotionOpen, setAddPromotionOpen] = useState(false);
  const [promotionExpiryDate, setPromotionExpiryDate] = useState(
    null as Date | null
  );
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '384',
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
        url: '/courses/' + id,
        method: 'GET',
      });
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  const onAddPromotion: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
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
        new Date(course?.discount.validUntil) > new Date()) ||
        false
    );

    setPromotionExpiryDate(
      new Date(course?.discount?.validUntil || new Date())
    );
  }, [course]);
  return (
    <Layout>
      <div className="my-4 space-y-4  ">
        <p className="text-3xl font-medium">{course?.title}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div
              className="w-full bg-gray-300 h-96 rounded-md flex justify-center items-center "
              // after:absolute after:inset-0 after:bg-black after:bg-opacity-50 after:content-[''] after:z-10 relative overflow-hidden"
              style={{
                backgroundImage: `url(${course?.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {
                <YouTube
                  videoId={course?.preview_video?.split('v=')[1]}
                  opts={opts}
                  onReady={onPlayerReady}
                />
              }
            </div>

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
              <div className="mt-2">
                {course?.subtitles?.map((section: Subtitle, index) => (
                  <div className="my-2" key={index}>
                    <p className="text-lg font-medium">{section.title}</p>
                    <p className="text-sm text-gray-500">
                      {section.duration} Hrs
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Instructor */}
          </div>
          <div className="  ">
            <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
              <img
                src={course?.thumbnail}
                alt=""
                className="overflow-hidden rounded-md"
              />
              <div>
                <p className="text-lg font-medium">{course?.title}</p>
                <p className="text-sm text-gray-500">
                  Rating: {course?.rating || 'No Rating yet'}
                </p>
              </div>

              <p className="text-3xl text-primary font-semibold">
                {course &&
                  Number(
                    course?.price *
                      (1 - (course?.discount?.amount ?? 0) / 100) *
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleCourse;
