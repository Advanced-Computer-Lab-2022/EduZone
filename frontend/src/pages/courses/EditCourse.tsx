import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Course } from '../../types/entities/Course';

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState(undefined as Course | undefined);
  const { user } = useSelector((state: RootState) => state.auth);
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
        method: 'GET',
      });
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!course) getCourse();
  }, [course]);

  return <div>EditCourse</div>;
};

export default EditCourse;
