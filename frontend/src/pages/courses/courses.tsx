import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryCards from '../../components/courses/CategoryCards';
import Layout from '../../components/layout/Trainee/Layout';
import { axios } from '../../utils';
import { FaFilter } from 'react-icons/fa';
import Truncate from '../../components/common/Truncate';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FaUserAlt } from 'react-icons/fa';
import CourseCard from '../../components/courses/CourseCard';
import FilterBox from '../../components/courses/FilterBox';
import CourseCardBlock from '../../components/courses/CourseCardBlock';
const Courses = () => {
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
        url: '/courses',
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
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  useEffect(() => {
    getCourses();
  }, [searchParams, currency]);

  return (
    <Layout>
      <div className="py-4">
        {/* {!searchParams.get('query') && <CategoryCards />} */}
        <div className="flex justify-between mt-4  gap-4 items-center">
          {searchParams.get('query') && (
            <div className="grow">
              <p className="text-2xl">
                Search results for{' '}
                <span className="font-medium">
                  "{searchParams.get('query')}"
                </span>
              </p>
              {/* Search Results for "{searchParams?.get('query')}" -- Total:{' '}
              {pagination?.total} -- Page: {pagination?.currentPage} -- Limit:{' '}
              {pagination?.pageSize} */}
            </div>
          )}
          {courses && (
            <div className="flex justify-end gap-4 grow">
              <button
                className="flex items-center p-2 px-4 bg-gray-300 rounded text-gray-700 gap-2"
                onClick={() => setFilterOpen((state) => !state)}
              >
                {' '}
                <FaFilter /> Filter
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 mt-4 gap-4">
          {
            <div
              className={`${
                filterOpen ? 'col-span-3 grid-cols-3' : 'col-span-4 grid-cols-4'
              } grid  gap-4 `}
            >
              {courses &&
                courses.length > 0 &&
                courses?.map((course) => (
                  <CourseCardBlock
                    course={course}
                    key={course._id.toString()}
                  />
                ))}

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
              <FilterBox navigate_path="courses" />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
