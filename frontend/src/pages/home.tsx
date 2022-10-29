import React from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/layout/Layout';
import { logout } from '../redux/features/auth.reducer';

const Home = () => {
  return (
    <Layout>
      <div className="my-3 flex flex-col gap-4">
        <div className="w-full bg-gray-300 h-60 my-4 rounded-lg" />

        <div className="grid grid-cols-4 gap-4">
          <div className="w-full bg-gray-300 h-32 rounded-lg"></div>
          <div className="w-full bg-gray-300 h-32 rounded-lg"></div>
          <div className="w-full bg-gray-300 h-32 rounded-lg"></div>
          <div className="w-full bg-gray-300 h-32 rounded-lg"></div>
        </div>
        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
          </div>
        </div>
        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
          </div>
        </div>

        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
          </div>
        </div>
        <div>
          <p className="text-2xl font-medium text-gray-600 my-2">Placeholder</p>
          <div className="grid grid-cols-5 gap-4">
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-52 rounded-lg"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
