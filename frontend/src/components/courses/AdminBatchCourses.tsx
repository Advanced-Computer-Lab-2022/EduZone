import { getCookie } from 'cookies-next';
import React from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../redux/features/ui.reducer';
import { axios } from '../../utils';
import SelectSearch from '../common/SelectSearch';

const AdminBatchCourses: React.FC<{
  courses: any[];
  closeModal: () => void;
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  selectAll: () => void;
  selectedUsers: string[];
}> = ({
  courses,
  closeModal,
  selected,
  onSelect,
  onRemove,
  selectAll,
  selectedUsers,
}) => {
  const dispatch = useDispatch();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = { ...Object.fromEntries(formData), courseIds: selected };
    console.log(data);
    console.log('Users', selectedUsers);
    const res = await axios({
      method: 'POST',
      url: '/courses/batch-courses',
      data: {
        ...data,
        userIds: selectedUsers,
      },
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    if (res.status === 200) {
      dispatch(
        showMessage({
          text: 'Courses added successfully',
          type: 'success',
        })
      );
      closeModal();
    }

    // closeModal();
  };
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

export default AdminBatchCourses;
