import { getCookie } from 'cookies-next';
import moment from 'moment';
import React from 'react';
import ReportedProblems from '../../components/courses/ReportedProblems';
import Layout from '../../components/layout/Trainee/Layout';

const TraineeReportedProblems = () => {
  return (
    <Layout>
      <ReportedProblems />
    </Layout>
  );
};

export default TraineeReportedProblems;
