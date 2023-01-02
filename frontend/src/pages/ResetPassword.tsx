import React from 'react';
import { useParams } from 'react-router-dom';
import ChangePassword from '../components/users/ChangePassword';

const ResetPassword = () => {
  const { token } = useParams();
  console.log(token);
  return (
    <div>
      <ChangePassword isReset={true} />
    </div>
  );
};

export default ResetPassword;
