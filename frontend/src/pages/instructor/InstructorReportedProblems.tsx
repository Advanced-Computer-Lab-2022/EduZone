import React from 'react';
import ReportedProblems from '../../components/courses/ReportedProblems';
import InstructorLayout from '../../components/layout/Instructor/InstructorLayout';

const InstructorReportedProblems = () => {
  return (
    <InstructorLayout>
      <ReportedProblems />
    </InstructorLayout>
  );
};

export default InstructorReportedProblems;
