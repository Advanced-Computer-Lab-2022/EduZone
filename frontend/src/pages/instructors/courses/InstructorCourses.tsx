import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CourseCard from '../../../components/courses/CourseCard';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import SearchBar from '../../../components/layout/Trainee/Navbar/SearchBar';
import { axios } from '../../../utils';

const InstructorCourses = () => {
  const { id } = useParams();
  const [courses, setCourses] = useState([] as any[]);
  const [pagination, setPagination] = useState({} as any);
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const getCourses = async () => {
    const query = searchParams.get('query') || undefined;
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: `/courses?instructor=${id}&query=${query || ''}`,
        method: 'GET',
      });
      console.log(res.data);
      setCourses(res.data?.courses);
      setPagination(res.data?.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, [searchParams]);

  const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="w-1/2">
        <SearchBar
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const query = formData.get('query');
            navigate(`/instructors/${id}/courses?query=${query}`);
          }}
        />
      </div>
      <div className="w-2/3 space-y-4">
        {courses &&
          courses.map((course) => {
            return (
              <tr key={course._id}>
                <CourseCard course={course} />
              </tr>
            );
          })}
      </div>
    </AdminLayout>
  );
};

export default InstructorCourses;
