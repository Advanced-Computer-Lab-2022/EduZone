import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import Layout from '../../components/layout/Layout';
import { RootState } from '../../redux/store';
import { Course } from '../../types/entities/Course';
import { Section } from '../../types/entities/Section';
import { axios } from '../../utils';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as Course | undefined);
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
        method: 'GET',
      });
      console.log(res.data);
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!course) getCourse();
  }, []);
  return (
    <Layout>
      <div className="my-4 space-y-4  ">
        <p className="text-3xl font-medium">{course?.title}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div
              className="w-full bg-gray-300 h-96 rounded-md flex justify-center items-center after:absolute after:inset-0 after:bg-black after:bg-opacity-50 after:content-[''] after:z-10 relative overflow-hidden"
              style={{
                backgroundImage: `url(${course?.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute z-20">
                <button
                  className="
                  bg-primary w-24 rounded-full aspect-square flex items-center justify-center text-white hover:bg-dark
                "
                >
                  {/* play button */}
                  <FaPlay size={30} className="translate-x-1" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center py-2">
              <Avatar name={course?.instructor?.name || ''} />
              <div className="ml-2">
                <p className="text-lg font-medium">
                  {course?.instructor?.name}
                </p>
              </div>
            </div>
            <p className="text-gray-400 font-bold">
              Duration :{' '}
              {course?.subtitles &&
                course?.subtitles?.reduce(
                  (acc: any, curr: any) => acc + curr.duration,
                  0
                ) + ' hrs'}{' '}
              hours
            </p>
            <div className="mt-4">
              <p className="text-2xl font-medium my-2">Summary</p>
              <hr />
              <p className="mt-2">{course?.summary}</p>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-medium my-2">Course Sections</p>
              <hr />
              <div className="mt-2">
                {course?.subtitles?.map((section: Section, index) => (
                  <div className="my-2" key={index}>
                    <p className="text-lg font-medium">{section.title}</p>
                    <p className="text-sm text-gray-500">
                      {section.duration} Hrs
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Instructor */}
          </div>
          <div className="  ">
            <div className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300 space-y-3">
              <img
                src={course?.thumbnail}
                alt=""
                className="overflow-hidden rounded-md"
              />
              <div>
                <p className="text-lg font-medium">{course?.title}</p>
                <p className="text-sm text-gray-500">
                  Rating: {course?.rating}
                </p>
              </div>

              <p className="text-3xl text-primary font-semibold">
                {course &&
                  Number(
                    course?.price *
                      (1 - (course?.discount ?? 0) / 100) *
                      conversion_rate
                  ).toFixed(2)}{' '}
                {currency}
              </p>

              <div className=" w-full space-y-2">
                <button className="w-full bg-primary text-white rounded-md py-2">
                  Buy Now
                </button>
                <button className="w-full border border-primary text-primary rounded-md py-2 hover:text-white hover:bg-primary">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleCourse;
