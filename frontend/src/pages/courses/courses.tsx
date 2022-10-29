import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { axios } from '../../utils';

const Courses = () => {
  const [courses, setCourses] = useState([] as any[]);
  const [pagination, setPagination] = useState({} as any);
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const getCourses = async () => {
    const query = searchParams.get('query');
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses',
        method: 'GET',
        params: {
          query,
          page,
          limit,
        },
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
      <div>
        Courses | Total: {pagination?.total} | Page: {pagination?.currentPage}|
        Search Results for "{searchParams?.get('query')}"
      </div>
    </Layout>
  );
};

export default Courses;
