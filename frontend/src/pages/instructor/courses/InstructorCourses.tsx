import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import CourseCard from '../../../components/courses/CourseCard';
import FilterBox from '../../../components/courses/FilterBox';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../../components/layout/Instructor/InstructorLayout';
import SearchBar from '../../../components/layout/common/navbar/trainee/SearchBar';
// import SearchBar from '../../../components/layout/Trainee/Navbar/SearchBar';
import { axios } from '../../../utils';
import CourseCardBlock from '../../../components/courses/CourseCardBlock';

const InstructorCourses = () => {
  const { id: instructorId } = useParams();
  const [courses, setCourses] = useState([] as any[]);
  const [pagination, setPagination] = useState({} as any);
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const getCourses = async () => {
    setLoading(true);
    const query = searchParams.get('query') || undefined;
    const price = searchParams.get('price') || undefined;
    const minPrice = searchParams.get('minPrice') || undefined;
    const maxPrice = searchParams.get('maxPrice') || undefined;
    const rating = searchParams.get('rating') || undefined;
    const subject = searchParams.get('subject') || undefined;
    const params = {
      page,
      limit,
      ...(query && { query }),
      ...(price && { price }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(rating && { rating }),
      ...(subject && { subject }),
    };

    try {
      const res: AxiosResponse<any, any> = await axios({
        url: `/courses?instructor=${instructorId}&query=${query || ''}`,
        method: 'GET',
        params: params,
      });
      setCourses(res.data?.courses);
      setPagination(res.data?.pagination);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, [searchParams]);

  const navigate = useNavigate();
  return (
    <InstructorLayout>
      <div className="w-full flex mb-4">
        <div className="grow">
          <SearchBar
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const query = formData.get('query');
              navigate(`/instructor/${instructorId}/courses?query=${query}`);
            }}
          />
        </div>
      </div>
      <div className="ml-auto w-fit flex space-x-4">
        <div className="flex justify-end gap-4 grow">
          <button
            className="flex items-center p-2 px-4 bg-gray-300 rounded text-gray-700 gap-2"
            onClick={() => setFilterOpen((state) => !state)}
          >
            {' '}
            <FaFilter /> Filter
          </button>
        </div>
        <Link
          to={`/courses/create?instructorId=${instructorId}`}
          className="bg-primary text-white flex text-center px-4 py-2 rounded-md w-fit"
        >
          <span>Create Course</span>
        </Link>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-4">
        {
          <div
            className={`${
              filterOpen ? 'col-span-3 grid-cols-4' : 'col-span-4 grid-cols-5'
            } grid gap-4`}
          >
            {courses &&
              courses.length > 0 &&
              courses?.map((course) => {
                return (
                  <CourseCardBlock
                    course={course}
                    key={course._id.toString()}
                    base={`/instructor/${instructorId}`}
                  />
                );
              })}

            {courses.length === 0 &&
              (!loading ? (
                <div className="text-2xl text-gray-500">No Courses Found</div>
              ) : (
                <div className="text-2xl text-gray-500">
                  Loading Courses ....
                </div>
              ))}
          </div>
        }
        {filterOpen && (
          <div>
            <FilterBox navigate_path={`instructor/${instructorId}/courses`} />
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default InstructorCourses;
