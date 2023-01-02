import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '../../components/common/ProfileCard';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../components/layout/Instructor/InstructorLayout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';
import Humanize from 'humanize-plus';
import moment from 'moment';
import NoData from './../../assets/illustrations/no_data.png';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { randomBytes } from 'crypto';
import IncomeChart from '../../components/instructor/IncomeChart';
import { FaUserAlt } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InstructorDashboard = () => {
  const [stats, setStats] = useState({} as any);
  const [feedback, setFeedback] = useState([] as any[]);
  const [courses, setCourses] = useState([] as any[]);
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { conversion_rate, currency } = useSelector(
    (state: RootState) => state.currency
  );

  const getStats = async () => {
    const res = await axios({
      url: `/statistics?view=instructor`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    setStats(res.data);
  };

  const getCourses = async () => {
    try {
      const res = await axios({
        url: `/courses?instructor=${user.name}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
      });
      setCourses(res.data.courses);
      // console.log('Courses', res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getRatingsAndReviews = async () => {
    try {
      const res = await axios({
        url: `/users/${user.id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
      });
      // console.log(res.data);
      setFeedback(res.data.feedback);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCourses();
    getRatingsAndReviews();
    getStats();
  }, []);

  return (
    <InstructorLayout>
      {/* <p className="text-2xl mb-2">Hello, {user.name}</p> */}
      <div className="w-full flex gap-5">
        <div className="grow">
          <div className="grid grid-cols-4 gap-5 h-36">
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Courses</p>
              <p className="text-3xl">{stats?.total_courses}</p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Students</p>

              <p className="text-3xl">
                {stats?.enrolled_students?.total}
                {/* <span className="text-base text-gray-400 ml-1">Students</span> */}
              </p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">{moment().format('MMMM')}'s Income</p>
              <p className="text-3xl">
                {Humanize.formatNumber(
                  stats?.income?.data.monthly.find(
                    (i: any) =>
                      i._id.month == new Date().getMonth() + 1 &&
                      i._id.year == new Date().getFullYear()
                  )?.total * conversion_rate || 0,
                  2
                )}
                <span className="text-base text-gray-400 ml-1">{currency}</span>
              </p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Earnings</p>
              <p className="text-3xl">
                {Humanize.formatNumber(
                  stats?.income?.total * conversion_rate || 0,
                  2
                )}
                <span className="text-base text-gray-400 ml-1">{currency}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-5 my-5 min-h-[20rem]">
            <IncomeChart income={stats?.income?.data.monthly} />

            <div className="bg-white p-5 max-h-[30rem] overflow-scroll space-y-5">
              <p className="text-xl font-medium">My Courses</p>
              {courses?.length > 0 ? (
                courses?.map((course: any, index: number) => (
                  <div
                    className="flex  w-full bg-gray-100 rounded-lg p-2 border gap-4 hover:border-primary cursor-pointer transition-all duration-300 ease-in-out "
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <img
                      src={
                        course.thumbnail ??
                        'https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg'
                      }
                      alt=""
                      className="w-1/6 rounded-lg aspect-square object-cover "
                    />
                    <div className=" w-full py-1">
                      <div className="flex justify-between w-full mb-2">
                        <div className="text-xl font-medium ">
                          {course.title}
                        </div>
                      </div>

                      <div className="mt-1 text-sm text-gray-500 font-medium">
                        Duration ≈{' '}
                        {course.subtitles &&
                          Math.ceil(
                            course?.subtitles?.reduce(
                              (acc: any, curr: any) => acc + curr.duration,
                              0
                            )
                          ) + ' hrs'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)]">
                  <img src={NoData} alt="empty" className="w-1/2" />
                  <p className="text-gray-500 text-xl">No courses yet</p>
                </div>
              )}
            </div>
            <div className="bg-white p-5">
              <p className="text-2xl mb-2">Reviews</p>
              <div className="overflow-scroll space-y-2 max-h-[20rem]">
                {feedback.map((item) => (
                  <div
                    className={`w-full shrink-0 text-sm bg-gray-200 h-fit py-2 px-4 rounded-lg `}
                    key={item._id.toString()}
                  >
                    <p className=" font-medium">{item.student.name}</p>
                    <p className="text-gray-500">Rating: {item.rating}</p>
                    <p className="text-gray-500">Review: {item.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/4 bg-white px-12 py-6 rounded-lg shadow">
          <ProfileCard />
        </div>
      </div>
      {/* <div className="flex my-5">
        <div
          className="w-1/4 h-32 bg-zinc-300 text-primary rounded-md flex justify-center items-center cursor-pointer hover:border border-primary"
          onClick={() => navigate(`/instructor/${id}/courses`)}
        >
          <p className="text-2xl">Courses</p>
        </div>
      </div> */}
    </InstructorLayout>
  );
};

export default InstructorDashboard;
