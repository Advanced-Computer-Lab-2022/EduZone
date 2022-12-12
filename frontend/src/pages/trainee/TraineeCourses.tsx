import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Trainee/Layout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

const TraineeCourses = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useSelector((state: RootState) => state.auth);

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
          <div
            key={course._id.toString()}
            className="bg-white rounded-md shadow-md"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-md"
            />
            <div className="p-2 px-4 my-3">
              <h3 className="text-xl font-medium">{course.title}</h3>
              <Link to={`/courses/${course._id}/learning`} className="w-full">
                <button className="bg-primary w-full text-white px-4 py-2 rounded-md mt-4">
                  Continue Learning
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default TraineeCourses;
