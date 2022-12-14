import React from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  console.log(token);
  return <div>ResetPassword: {token}</div>;
};

export default ResetPassword;
