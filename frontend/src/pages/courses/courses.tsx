import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryCards from '../../components/courses/CategoryCards';
import Layout from '../../components/layout/Layout';
import { axios } from '../../utils';
import { FaFilter } from 'react-icons/fa';
import Truncate from '../../components/common/Truncate';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FaUserAlt } from 'react-icons/fa';
import CourseCard from '../../components/courses/CourseCard';
import FilterBox from '../../components/courses/FilterBox';
const Courses = () => {
  const [courses, setCourses] = useState([] as any[]);
  const [pagination, setPagination] = useState({} as any);
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const getCourses = async () => {
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
      console.log(res.data);
      setCourses(res.data?.courses);
      setPagination(res.data?.pagination);
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
        {!searchParams.get('query') && <CategoryCards />}
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
                filterOpen ? 'col-span-3' : 'col-span-4'
              } flex flex-col space-y-4 `}
            >
              {courses &&
                courses.length > 0 &&
                courses?.map((course) => (
                  <CourseCard course={course} key={course._id.toString()} />
                ))}

              {courses.length === 0 && (
                <div className="text-2xl text-gray-500">No Courses Found</div>
              )}
            </div>
          }
          {filterOpen && (
            <div>
              <FilterBox />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
