import { AxiosResponse } from 'axios';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../../components/layout/navbar/common/ProfileMenu/Avatar';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { Course } from '../../../types/entities/Course';
import { Subtitle } from '../../../types/entities/Subtitle';
import { axios } from '../../../utils';
import YouTube, { YouTubeProps } from 'react-youtube';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import IconText from '../../../components/common/IconText';
import { MdEditNote } from 'react-icons/md';
import { getCookie } from 'cookies-next';
import RatingBox from '../../../components/courses/RatingBox';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [withPromotion, setWithPromotion] = useState(false);
  const [addPromotionOpen, setAddPromotionOpen] = useState(false);
  const [rating, setRating] = useState(undefined as number | undefined);
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

  const onBuyCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id + '/buy',
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
      });
      navigate('/courses/' + id + '/learning');
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
      // setWithPromotion(
      //   (res.data.discount &&
      //     new Date(res.data.discount.validUntil) >= new Date()) ||
      //     false
      // );
      // setPromotionExpiryDate(
      //   new Date(res.data?.discount?.validUntil || new Date())
      // );

      // setRating(
      //   res.data.enrolled?.reduce(
      //     (acc: any, curr: any) => acc + curr.rating || 0,
      //     0
      //   )
      // );
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
    console.log(rating);
  }, [course]);
  return (
    <Layout>
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
            // onClick={()=>navigate(`/instructor/${course?.instructor._id}/profile`)}
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
          <div className="mt-4">
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
                  <button
                    className="w-full bg-primary text-white rounded-md py-2"
                    onClick={() => onBuyCourse()}
                  >
                    Buy Now
                  </button>
                  <button className="w-full border border-primary text-primary rounded-md py-2 hover:text-white hover:bg-primary">
                    Add to Wishlist
                  </button>
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
