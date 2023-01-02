import React, { useState } from 'react';
import courses from '../../pages/courses/courses';
import { axios } from '../../utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectSearch from '../../components/common/SelectSearch';
import { getCookie } from 'cookies-next';
const AdminBatchPromotion: React.FC<{
  courses: any[];
  closeModal: () => void;
  updateCourse: (course: any[]) => void;
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  selectAll: () => void;
}> = ({
  courses,
  closeModal,
  updateCourse,
  selected,
  onSelect,
  onRemove,
  selectAll,
}) => {
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
    updateCourse(
      courses.map((course) => {
        if (selected.includes(course._id)) {
          return res.data.find((c: any) => c._id === course._id);
        }
        return course;
      })
    );

    closeModal();
  };

  const [promotionExpiryDate, setPromotionExpiryDate] = useState(
    null as Date | null
  );
  const [promotionStartDate, setPromotionStartDate] = useState(
    null as Date | null
  );
  return (
    <div className="bg-white p-4 rounded-md">
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <div className="flex justify-between">
            <label htmlFor="courses">Courses</label>
            <div className="flex gap-3">
              <div className="text-sm text-gray-500">
                {selected.length} selected
              </div>
              º
              <p
                className="text-sm text-primary cursor-pointer"
                onClick={() => selectAll()}
              >
                {selected.length === courses.length
                  ? 'Deselect all'
                  : 'Select all'}
              </p>
            </div>
          </div>
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
          onClick={() => closeModal()}
        >
          Cancel
        </div>
      </form>
    </div>
  );
};

export default AdminBatchPromotion;
