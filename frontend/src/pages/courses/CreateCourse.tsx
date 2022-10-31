import React from 'react';
import InputFieldCourse from '../../components/common/InputField';
import { MdEmail } from 'react-icons/md';

//import axios from '../utils';

const AdminCreateUser = () => {
  return (
    <div className="mt-8 ml-2 mr-2 grid grid-rows-3 gap-4">
      <div>
        <p className="text-3xl font-medium ">Add New Course</p>
      </div>
      <div>
        <input
          type="text"
          className="bg-primary border border-gray-300 text-white text-2xl rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-7"
          placeholder="Course Title Goes Here"
          name="Price"
        />
      </div>
      <div className=" flex justify-between">
        <div>
          <p>Category</p>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3 pr-20"
            placeholder="Please Enter Your Category"
            name="Price"
          />
        </div>
        <div>
          <p>Section</p>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3 "
            placeholder="Please Enter Your Section"
            name="Price"
          />
        </div>
        <div>
          <p>Price</p>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3 "
            placeholder="Please Enter Your Price"
            name="Price"
          />
        </div>
      </div>
      <div>
        <p>Description </p>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-20"
          placeholder="Please Enter the Course Description"
          name="Price"
        />
      </div>
      <div>
        <button>submit</button>
      </div>
    </div>
  );
};

export default AdminCreateUser;
