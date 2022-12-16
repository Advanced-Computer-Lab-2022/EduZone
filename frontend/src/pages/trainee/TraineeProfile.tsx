import React from 'react';
import Layout from '../../components/layout/Trainee/Layout';
import UpdateUser from '../../components/users/UpdateUser';
import UserProfile from '../../components/users/UserProfile';

const TraineeProfile = () => {
  return (
    <Layout>
      <div className="flex items-center h-full justify-center">
        <UserProfile />
      </div>
    </Layout>
  );
};

export default TraineeProfile;
