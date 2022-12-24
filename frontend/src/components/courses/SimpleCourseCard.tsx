import React, { FormEventHandler, useState } from 'react';
import { Course } from '../../types/entities/Course';
import { TbDots } from 'react-icons/tb';
import { MdOutlineReport } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Trainee/Layout';
import { RootState } from '../../redux/store';
import Modal from '../common/Modal';
import { axios } from '../../utils';
import { getCookie } from 'cookies-next';
const SimpleCourseCard: React.FC<{ course: Course | any }> = ({ course }) => {
  const [reportOpen, setReportOpen] = useState(false);
  const { role, id } = useSelector((state: RootState) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const reportProblem: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const res = await axios({
      url: `/courses/${course?._id}/problems`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        problem: {
          type: formData.get('problem'),
          description: formData.get('description'),
        },
      },
    });
    if (res.status === 201) {
      setOpenModal(false);
    }
  };

  const navigate = useNavigate();
  return (
    <div>
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={'Report Problem'}
      >
        <form className="px-3" onSubmit={reportProblem}>
          <label htmlFor="problem">Problem</label>
          <select
            name="problem"
            id="problem"
            className="w-full p-2 px-4 border rounded-md mb-3"
          >
            <option value="" disabled selected>
              Select a problem
            </option>
            <option value="technical">Technical</option>
            <option value="financial">Financial</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="description" className="mt-2">
            Description
          </label>
          <textarea
            name="description"
            id=""
            cols={30}
            rows={5}
            className="w-full p-4 border rounded-md"
            placeholder="Description of the problem"
          ></textarea>
          <div className="w-full flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded-md mt-4 ">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      <div
        key={course._id.toString()}
        className="bg-white rounded-md shadow-md relative pb-0.5"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-md cursor-pointer"
          onClick={() => navigate(`/courses/${course._id}`)}
        />
        {role !== 'admin' && (
          <div className=" absolute z-30 top-2 right-2 space-y-2 text-gray-600">
            <div
              className="ml-auto flex items-center justify-center bg-white w-fit  p-1 shadow-md rounded-md  cursor-pointer "
              onClick={() => setReportOpen((s) => !s)}
            >
              {reportOpen ? <IoMdClose size={25} /> : <TbDots size={25} />}
            </div>
            {reportOpen && (
              <div>
                <div
                  className="bg-white py-2 px-3 rounded-md flex items-center gap-1 cursor-pointer hover:underline"
                  onClick={() => setOpenModal(true)}
                >
                  <MdOutlineReport size={20} />
                  <p>Report problem</p>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="p-2 px-4 my-3">
          <h3 className="text-xl font-medium">{course.title}</h3>
          {course?.enrolled.find((s: any) => s.studentId === id)?.status ===
          'active' ? (
            <Link to={`/courses/${course._id}/learning`} className="w-full">
              <button className="bg-primary w-full text-white px-4 py-2 rounded-md mt-4">
                Continue Learning
              </button>
            </Link>
          ) : (
            <Link to={`/courses/${course._id}`} className="w-full">
              <button className="bg-primary w-full text-white px-4 py-2 rounded-md mt-4">
                Go to Course
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCourseCard;
