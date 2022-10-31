import React, { FormEventHandler } from 'react';
import InputFieldCourse from '../../components/common/InputField';
import { MdEmail } from 'react-icons/md';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { axios } from '../../utils';

//import axios from '../utils';

const AdminCreateUser = () => {
  const [searchParams] = useSearchParams();
  const instructorId = searchParams.get('instructorId');
  const navigate = useNavigate();
  const onSubmit: FormEventHandler = async (e) => {
    console.log('Here');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = { ...Object.fromEntries(formData), instructor: instructorId };
    try {
      const res = await axios({
        url: `/courses`,
        method: 'POST',
        data,
      });
      if (res.status === 201) {
        navigate(`/instructors/${instructorId}/courses`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AdminLayout>
      <div className="mt-8 ml-2 mr-2gap-4">
        <div>
          <p className="text-3xl font-medium ">Add New Course</p>
        </div>
        <form className="w-1/2" onSubmit={onSubmit} method="POST">
          <div className="">
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="Course Title Goes Here"
              name="title"
            />
          </div>
          <div className=" flex flex-col justify-between">
            <div>
              <p>Subject</p>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                placeholder="Enter Subject"
                name="subject"
              />
            </div>
            {/* <div>
              <p>Section</p>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3 "
                placeholder="Please Enter Your Section"
                name="Price"
              />
            </div> */}
            <div>
              <p>Price</p>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                placeholder="Course Price"
                name="price"
              />
            </div>
          </div>
          <div>
            <p>Description </p>
            <textarea
              rows={10}
              className="w-full p-4 rounded-md"
              placeholder="Please Enter the Course Description"
              name="summary"
            />
          </div>
          <div>
            <input
              type="submit"
              value="Submit"
              className="p-2 px-4 bg-primary text-white cursor-pointer"
            />
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateUser;
