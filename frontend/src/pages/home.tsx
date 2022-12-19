import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Truncate from '../components/common/Truncate';
import CategoryCards from '../components/courses/CategoryCards';
import DisplayRating from '../components/courses/DisplayRating';
import PopularCourses from '../components/courses/PopularCourses';
import Layout from '../components/layout/Trainee/Layout';
import { logout } from '../redux/features/auth.reducer';
import { RootState } from '../redux/store';
import { Course } from '../types/entities/Course';
import { axios, calculateCourseRating } from '../utils';

const Home = () => {
  return (
    <Layout>
      <div className="my-3 flex flex-col gap-4">
        <div className="w-full bg-gray-300 h-60 my-4 rounded-lg  flex justify-center items-center">
          <Link to="/courses">
            <button className="bg-primary text-white font-medium py-2 px-4 rounded ">
              Explore Courses
            </button>
          </Link>
        </div>
        <CategoryCards />
        <PopularCourses />
        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
          </div>
        </div>

        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
          </div>
        </div>
        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg animate-pulse duration-150"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
