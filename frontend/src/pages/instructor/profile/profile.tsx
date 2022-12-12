import { getCookie, getCookies } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../../components/layout/Instructor/InstructorLayout';
import Avatar from '../../../components/layout/navbar/common/ProfileMenu/Avatar';
import { updateUser } from '../../../redux/features/auth.reducer';
import { RootState } from '../../../redux/store';
import axios from '../../../utils/axios';

const InstructorProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [feedback, setFeedback] = useState([] as any[]);
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([] as any[]);
  const onCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setBio(user.bio);
  };

  const getCourses = async () => {
    try {
      const res = await axios({
        url: `/courses?instructor=${user.id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
      });
      setCourses(res.data.courses);
      console.log('Courses', res.data);
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
      console.log(res.data);
      setFeedback(res.data.feedback);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCourses();
    getRatingsAndReviews();
  }, []);

  const onUpdate = async () => {
    const data = {
      name,
      email,
      bio,
    };
    const res = await axios({
      url: `/users/${user.id}`,
      method: 'PUT',
      data,
    });
    if (res.status === 202) {
      dispatch(
        updateUser({
          ...res.data,
          refreshToken: undefined,
          password: undefined,
          lastLogin: undefined,
          id: res.data._id,
          _id: undefined,
          __v: undefined,
        })
      );
    }
  };
  const navigate = useNavigate();
  return (
    <InstructorLayout>
      {/* <p className="text-2xl text-center">Welcome, {user.name} </p> */}
      <div className="flex items-start h-full justify-start">
        <div className="flex flex-col items-center p-8 my-4 rounded- border-r-2 border-r-primary">
          <div>
            {user.img ? (
              <img
                src={user.img}
                alt="profile"
                className="w-52 h-52 rounded-full"
              />
            ) : (
              <div className="w-52 h-52 rounded-full bg-gray-300 font-medium text-6xl flex items-center justify-center text-gray-500">
                {user?.name.toUpperCase()[0]}
              </div>
            )}
            <p className="text-xl font-semibold text-gray-500 text-center my-2">
              {user.role.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col flex-wrap">
            <div className="flex-col gap-4 my-4 justify-center flex-wrap w-full lg:flex">
              <div className="flex flex-col ">
                <label htmlFor="">Name</label>
                <input
                  type="text"
                  className="px-4 border-2 border-gray-300 rounded-md p-2 w-96"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  className="border-2 px-4 border-gray-300 rounded-md p-2 w-96"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="">
              <label htmlFor="">Bio</label>
              <textarea
                name="bio"
                id="bio"
                className="border-2 border-gray-300 rounded-md lg:w-full  px-4 py-3"
                placeholder="Enter your biography"
                value={bio}
                rows={5}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="flex w-[49rem] space-x-6 justify-center mt-5">
            <button
              className="border-2   border-gray-400 w-40 text-gray-700 px-4 py-2 rounded-md mt-4"
              onClick={() => onCancel()}
            >
              Cancel
            </button>
            <button
              disabled={
                name === user.name && email === user.email && bio === user.bio
              }
              className="bg-primary w-40 text-white px-4 py-2 rounded-md mt-4 disabled:bg-primary/50 disabled:cursor-not-allowed"
              onClick={() => onUpdate()}
            >
              Update
            </button>
          </div>
        </div>
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
