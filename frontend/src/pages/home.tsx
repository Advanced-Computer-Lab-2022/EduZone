import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CategoryCards from '../components/courses/CategoryCards';
import Layout from '../components/layout/Layout';
import { logout } from '../redux/features/auth.reducer';

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
