import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Trainee/Layout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';
import NoData from './../../assets/illustrations/no_data.png';
import SimpleCourseCard from '../../components/courses/SimpleCourseCard';
const TraineeCourses = () => {
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
    console.log(res);
  };
  useEffect(() => {
    fetchTraineeCourses();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold my-8 ">My Courses</h1>
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <img src={NoData} alt="No Data" className="w-80" />
          <h1 className="text-2xl font-semibold my-8 text-gray-600">
            No Courses Found
          </h1>
          <Link
            to="/courses"
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6 ">
          {courses.map((course: any) => (
            <SimpleCourseCard course={course} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default TraineeCourses;
