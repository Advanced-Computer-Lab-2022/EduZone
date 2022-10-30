import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryCards from '../../components/courses/CategoryCards';
import Layout from '../../components/layout/Layout';
import { axios } from '../../utils';
import { FaFilter } from 'react-icons/fa';
const Courses = () => {
  const [courses, setCourses] = useState([] as any[]);
  const [pagination, setPagination] = useState({} as any);
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const getCourses = async () => {
    const query = searchParams.get('query') || undefined;
    let params: any = {
      page,
      limit,
    };
    if (query) {
      params = {
        ...params,
        query,
      };
    }
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
  useEffect(() => {
    getCourses();
  }, [searchParams]);
  return (
    <Layout>
      <div className="py-4">
        {!searchParams.get('query') && <CategoryCards />}
        <div className="flex justify-between mt-4  gap-4 items-center">
          {searchParams.get('query') && (
            <div className="grow">
              Search Results for "{searchParams?.get('query')}" -- Total:{' '}
              {pagination?.total} -- Page: {pagination?.currentPage} -- Limit:{' '}
              {pagination?.pageSize}
            </div>
          )}
          <div className="flex justify-end gap-4 grow">
            <button
              className="flex items-center p-2 px-4 bg-gray-300 rounded text-gray-700 gap-2"
              onClick={() => setFilterOpen((state) => !state)}
            >
              {' '}
              <FaFilter /> Filter
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 mt-4 gap-4">
          <div
            className={`${
              filterOpen ? 'col-span-3' : 'col-span-4'
            } flex flex-col space-y-4 `}
          >
            {courses?.map((course) => (
              <div
                key={course._id}
                className="flex items-center w-full bg-gray-100 h-52 rounded-lg p-4 border gap-4"
              >
                <img
                  src="https://via.placeholder.com/150/DEDEDE/808080?text=Thumbnail"
                  alt=""
                  className="h-full rounded-lg"
                />
                <div>
                  <div className="text-2xl font-bold px-2 h-full">
                    {course.title}
                  </div>
                  <div className="text-gray-500 px-2 h-full">
                    {course.summary}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filterOpen && (
            <div className="w-full bg-gray-300 h-full rounded-lg"></div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
