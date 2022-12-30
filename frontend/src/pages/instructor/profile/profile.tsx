import { getCookie, getCookies } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../../components/layout/Instructor/InstructorLayout';
import Avatar from '../../../components/layout/common/navbar/ProfileMenu/Avatar';
import { updateUser } from '../../../redux/features/auth.reducer';
import { RootState } from '../../../redux/store';
import axios from '../../../utils/axios';
import UserProfile from '../../../components/users/UserProfile';

const InstructorProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [feedback, setFeedback] = useState([] as any[]);
  const [courses, setCourses] = useState([] as any[]);

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
    if (user.role === 'instructor') {
      getCourses();
      getRatingsAndReviews();
    }
  }, []);

  const navigate = useNavigate();
  return (
    <InstructorLayout>
      {/* <p className="text-2xl text-center">Welcome, {user.name} </p> */}
      <div className="flex items-start h-full justify-start">
        <UserProfile />
        <div className="h-full grow p-8 space-y-5">
          <div className={'space-y-5'}>
            <p className="text-2xl font-semibold">My Ratings and Reviews</p>
            <div className={'relative'}>
              <div className="flex gap-5 overflow-x-scroll">
                {feedback.map((item) => (
                  <div
                    className={`w-1/3  shrink-0 text-sm bg-gray-200 h-fit py-2 px-4 rounded-lg `}
                    key={item._id.toString()}
                  >
                    <p className=" font-medium">{item.student.name}</p>
                    <p className="text-gray-500">Rating: {item.rating}</p>
                    <p className="text-gray-500">Review: {item.review}</p>
                  </div>
                ))}
              </div>
              <div className="absolute w-10 h-10 -right-5 top-1/2 -translate-y-5 bg-black/30 rounded-full text-white flex items-center justify-center">
                {'>'}
              </div>
            </div>
          </div>
          <div className={'space-y-5'}>
            <p className="text-2xl font-semibold">My Courses</p>
            <div className={'relative'}>
              <div className="flex gap-5 overflow-x-scroll pb-2">
                {courses?.map((item) => (
                  <div
                    className={`w-fit  shrink-0 text-sm bg-gray-200  rounded-lg px-5 py-2 justify-center flex flex-col cursor-pointer hover:bg-gray-300`}
                    key={item._id.toString()}
                    onClick={() =>
                      navigate(`/instructor/${user.id}/courses/${item._id}`)
                    }
                  >
                    <p className="font-medium text-lg">{item.title}</p>
                    <p className="text-gray-500">
                      {item.isPublished ? 'Published' : 'Not Published'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute w-10 h-10 -right-5 top-1/2 -translate-y-5 bg-black/30 rounded-full text-white flex items-center justify-center">
                {'>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorProfile;
