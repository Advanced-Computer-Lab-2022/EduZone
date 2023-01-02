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
        <div
          className="w-full bg-gray-300 h-72 my-4 rounded-lg  flex justify-center items-center before:bg-black before:bg-opacity-50 before:bg-blend-overlay before:absolute before:inset-0 before:z-10 before:rounded-lg before:content before:' relative"
          style={{
            backgroundImage: `url("/cover.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute z-50 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl font-semibold  ">
              Empowering learners, enriching communities.
            </h1>
            <Link to="/courses">
              <button className="bg-primary text-white font-medium py-2 px-4 rounded mt-4">
                Explore Our Courses
              </button>
            </Link>
          </div>
        </div>
        {/* <CategoryCards /> */}
        <PopularCourses />
        <div className="absolute bottom-0 left-0 w-full bg-gray-300 py-2 text-center">
          Copyright 2021 EduZone. All rights reserved.
        </div>
        {/* <div>
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
        </div> */}
      </div>
    </Layout>
  );
};

export default Home;
