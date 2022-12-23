import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Trainee/Layout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

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
      <div className="grid grid-cols-4 gap-6 ">
        {courses.map((course: any) => (
          <SimpleCourseCard course={course} />
        ))}
      </div>
    </Layout>
  );
};

export default TraineeCourses;
