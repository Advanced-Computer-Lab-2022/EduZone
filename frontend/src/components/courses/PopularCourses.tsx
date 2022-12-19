import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Course } from '../../types/entities/Course';
import { axios, calculateCourseRating } from '../../utils';
import Truncate from '../common/Truncate';
import CourseCardBlock from './CourseCardBlock';
import DisplayRating from './DisplayRating';

const PopularCourses = () => {
  const [popularCourses, setPopularCourses] = useState([] as Course[]);
  const getMostPopularCourses = async () => {
    const res = await axios({
      method: 'GET',
      url: '/courses/popular?limit=4',
    });
    console.log(res);
    setPopularCourses(res.data);
  };

  React.useEffect(() => {
    getMostPopularCourses();
  }, []);
  return (
    <div>
      <p className="text-2xl font-medium text-gray-600 my-2">
        Most Popular Courses
      </p>
      <div className="grid grid-cols-4 gap-4">
        {popularCourses.map((course) => (
          <CourseCardBlock course={course} />
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;
