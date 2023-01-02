import React, { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import CourseCardBlock from '../../components/courses/CourseCardBlock';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { axios } from '../../utils';

import AdminBatchPromotion from '../../components/courses/AdminBatchPromotion';
const AdminCourses = () => {
  const [courses, setCourses] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const getAllCourses = async () => {
    setLoading(true);
    const res = await axios({
      method: 'GET',
      url: '/courses',
    });
    setCourses(res.data.courses);
    console.log(res.data.courses);
    setLoading(false);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState([] as string[]);
  const onSelect = (value: string) => {
    if (selected.includes(value)) {
      setSelected((selected as string[]).filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const onRemove = (value: string) => {
    setSelected((selected as string[]).filter((item) => item !== value));
  };

  const updateCourse = (courses: any[]) => {
    setCourses(courses);
  };

  useEffect(() => {
    if (courses.length === 0) getAllCourses();
  }, []);

  const selectAll = () => {
    if (selected.length === courses.length) {
      setSelected([]);
    } else {
      setSelected(courses.map((course) => course._id.toString()));
    }
  };

  return (
    <AdminLayout>
      <Modal
        title="Add Promotions"
        open={modalOpen}
        close={() => {
          setModalOpen(false);
          setSelected([]);
        }}
      >
        <AdminBatchPromotion
          courses={courses}
          closeModal={() => {
            setModalOpen(false);
            setSelected([]);
          }}
          updateCourse={updateCourse}
          selected={selected}
          onSelect={onSelect}
          onRemove={onRemove}
          selectAll={selectAll}
        />
      </Modal>
      <div className="flex justify-between items-center">
        <h1 className="flex items-center text-3xl font-medium">
          <p>Courses</p>
          <span className="text-gray-500 ml-2 text-base">
            ({courses.length})
          </span>
        </h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-sm"
          onClick={() => setModalOpen(true)}
        >
          Add Promotion
        </button>
      </div>
      <div className="grid grid-cols-5 mt-4 gap-4">
        {courses &&
          courses.length > 0 &&
          courses?.map((course) => (
            <CourseCardBlock course={course} key={course._id.toString()} />
          ))}

        {courses.length === 0 &&
          (!loading ? (
            <div className="text-2xl text-gray-500">No Courses Found</div>
          ) : (
            <div className="text-2xl text-gray-500">Loading Courses ....</div>
          ))}
      </div>
    </AdminLayout>
  );
};
export default AdminCourses;
