import React from 'react';
import { useLocation } from 'react-router-dom';
import InstructorLayout from '../../../components/layout/Instructor/InstructorLayout';
import ChangePassword from '../../../components/users/ChangePassword';

const InstructorChangePassword = () => {
  return (
    <InstructorLayout>
      <ChangePassword />
    </InstructorLayout>
  );
};

export default InstructorChangePassword;
