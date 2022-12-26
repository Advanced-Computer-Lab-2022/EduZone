import React, { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import CourseCardBlock from '../../components/courses/CourseCardBlock';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { axios } from '../../utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectSearch from '../../components/common/SelectSearch';
import { getCookie } from 'cookies-next';
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

  const [promotionExpiryDate, setPromotionExpiryDate] = useState(
    null as Date | null
  );
  const [promotionStartDate, setPromotionStartDate] = useState(
    null as Date | null
  );
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

  useEffect(() => {
    if (courses.length === 0) getAllCourses();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = { ...Object.fromEntries(formData), courseIds: selected };
    console.log(data);
    const res = await axios({
      method: 'POST',
      url: '/courses/batch-promotions',
      data,
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    setCourses(
      courses.map((course) => {
        if (selected.includes(course._id)) {
          return res.data.find((c: any) => c._id === course._id);
        }
        return course;
      })
    );

    setModalOpen(false);
    setSelected([]);
  };

  return (
    <AdminLayout>
      <Modal
        open={modalOpen}
        close={() => {
          setModalOpen(false);
          setSelected([]);
        }}
      >
        <div className="bg-white p-4 rounded-md">
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <label htmlFor="courses">Courses</label>
              <SelectSearch
                items={courses?.map((c) => ({ _id: c._id, name: c.title }))}
                multiple={true}
                selected={selected}
                onSelect={onSelect}
                onRemove={onRemove}
              />
            </div>

            <div className="mb-5">
              <label htmlFor="amount">Discount Amount</label>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary outline-primary block w-full p-3 mb-3"
                placeholder="Discount Amount"
                name="amount"
                min={0}
                max={100}
                required
              />
            </div>
            <div className="flex gap-2 w-full mb-5">
              <div className="w-full">
                <label htmlFor="validFrom">Start Date</label>
                <DatePicker
                  name="validFrom"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary outline-primary block w-full p-3 mb-3 "
                  selected={promotionStartDate}
                  onChange={(date: Date) => setPromotionStartDate(date)}
                  required
                  minDate={new Date()}
                  placeholderText="Start Date"
                />
              </div>

              <div className="w-full">
                <label htmlFor="validUntil">End Date</label>
                <DatePicker
                  name="validUntil"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary focus:border-primary outline-primary block w-full p-3 mb-3"
                  selected={promotionExpiryDate}
                  onChange={(date: Date) => setPromotionExpiryDate(date)}
                  required
                  minDate={promotionStartDate ?? new Date()}
                  placeholderText="End Date"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-white rounded-md py-2 mb-2">
              Save
            </button>
            <div
              className="text-center w-full cursor-pointer bg-gray-400 text-white rounded-md py-2"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </div>
          </form>
        </div>
      </Modal>
      <h1 className="text-3xl font-medium">Courses</h1>
      <div>
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
