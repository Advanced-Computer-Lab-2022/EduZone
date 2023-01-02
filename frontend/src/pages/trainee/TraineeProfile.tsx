import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaLock, FaUserAlt, FaWallet } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { MdEdit, MdOndemandVideo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Divider from '../../components/common/Divider';
import Modal from '../../components/common/Modal';
import ProfileCard from '../../components/common/ProfileCard';
import Truncate from '../../components/common/Truncate';
import CourseCard from '../../components/courses/CourseCard';
import Layout from '../../components/layout/Trainee/Layout';
import UpdateUser from '../../components/users/UpdateUser';
import UserProfile from '../../components/users/UserProfile';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';
import NoData from './../../assets/illustrations/no_data.png';
import NoTransactions from './../../assets/illustrations/no_transactions.png';
const TraineeProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  const [courses, setCourses] = useState([]);

  const fetchTraineeCourses = async () => {
    const res = await axios({
      url: `/courses/trainee`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    setCourses(res.data);
    // console.log(res);
  };

  const navigate = useNavigate();
  useEffect(() => {
    fetchTraineeCourses();
  }, []);

  return (
    <Layout>
      <div className="  h-[calc(100vh-10rem)] justify-center gap-5 grid grid-cols-3 my-10">
        <div className="h-full max-h-[calc(100vh-10rem)]  bg-white  rounded-lg p-16">
          <ProfileCard />
        </div>
        <div className="h-full w-full flex flex-col space-y-5">
          <div className="h-full bg-white rounded-lg px-10 py-10 space-y-5">
            <div className="text-gray-700 flex items-baseline gap-3">
              <FaWallet size={25} />
              <p className="text-3xl font-medium ">Wallet</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-lg">Balance</p>
                <p className=" font-medium ">
                  <span className="text-gray-500">{currency}</span>
                  <span className="text-xl text-primary">
                    {' '}
                    {Number(user.wallet.balance * conversion_rate).toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="">
                <p className="text-gray-500 text-lg">Transactions</p>
                <div className="ml-3 overflow-y-scroll">
                  {user.wallet.transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-[calc(50vh)]">
                      <img
                        src={NoTransactions}
                        alt="No Transactions"
                        className="w-2/3"
                      />
                      <p className="text-gray-500 text-lg">
                        No Transactions Yet
                      </p>
                    </div>
                  ) : (
                    user.wallet.transactions
                      .sort((a: any, b: any) => b.date - a.date)
                      .map((transaction: any, index: number) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between items-center">
                            <p className="text-gray-500 text-xs">
                              {moment(transaction.date).format('DD MMM YYYY')}
                            </p>
                            <p className="font-medium -space-y-1">
                              <span
                                className={`mr-0.5 text-sm  ${
                                  transaction.type === 'income'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                                {Number(
                                  transaction.amount * conversion_rate
                                ).toFixed(2)}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {currency}
                              </span>
                            </p>
                          </div>
                          <p className="text-gray-900 text-sm ">
                            {transaction.description}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full max-h-[calc(100vh-10rem)] overflow-scroll w-full bg-white  space-y-3 p-8 rounded-lg">
          <p className="text-3xl font-medium ">Courses</p>
          <div className="flex flex-col gap-3">
            {courses?.length > 0 ? (
              courses?.map((course: any, index: number) => (
                <div
                  className="flex  w-full bg-gray-100 rounded-lg p-2 border gap-4 hover:border-primary cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <img
                    src={
                      course.thumbnail ??
                      'https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg'
                    }
                    alt=""
                    className="w-1/4 rounded-lg aspect-square object-cover "
                  />
                  <div className=" w-full py-1">
                    <div className="flex justify-between w-full mb-2">
                      <div className="text-xl font-medium ">{course.title}</div>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      {course?.instructor?.name && (
                        <div className="flex items-center gap-2 text-gray-500 ">
                          <FaUserAlt />
                          <p className=" ">{course?.instructor?.name}</p>
                        </div>
                      )}
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
        </div>

        {/* <UserProfile /> */}
      </div>
    </Layout>
  );
};

export default TraineeProfile;
