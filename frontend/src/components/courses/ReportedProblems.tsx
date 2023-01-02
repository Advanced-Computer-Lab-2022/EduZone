import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';
import LoadingComponent from '../common/LoadingComponent';
import ReportedProblemCard from './ReportedProblemCard';
import NoData from './../../assets/illustrations/no_data.png';
const ReportedProblems: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useSelector((state: RootState) => state.auth.user);
  const [problems, setProblems] = useState([] as any[]);
  const getReportedProblems = async () => {
    setLoading(true);
    const res = await axios({
      url: `/users/${id}/problems`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    setProblems(res.data);
    setLoading(false);
  };

  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    getReportedProblems();
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);
  return (
    <div>
      <h1 className="my-5 text-2xl font-medium text-gray-700">
        Your Reported Problems
      </h1>
      {loading ? (
        <LoadingComponent />
      ) : problems.length > 0 ? (
        <div className="my-4">
          <p className="mb-2 text-lg text-gray-600">Unresolved Problems</p>
          <div className="grid grid-cols-3 mb-6 space-x-5">
            {problems.filter((p) => p.status === 'UNSEEN').length > 0 ? (
              problems
                .filter((p) => p.status === 'UNSEEN')
                .map((p) => (
                  <ReportedProblemCard
                    key={p._id}
                    _id={p._id}
                    problem={p.problem}
                    status={'UNRESOLVED'}
                    reportedAt={p.reportedAt}
                    type={p.problemType}
                    course={p.course}
                    onRefresh={() => setRefresh(true)}
                    followup={p.followUp}
                  />
                ))
            ) : (
              <div>You have no unresolved problems yet.</div>
            )}
          </div>
          <p className="mb-2 text-lg text-gray-600 ">Pending Problems</p>
          <div className="grid grid-cols-3  mb-6 space-x-5">
            {problems.filter((p) => p.status === 'PENDING').length > 0 ? (
              problems
                .filter((p) => p.status === 'PENDING')
                .map((p) => (
                  <ReportedProblemCard
                    key={p._id}
                    _id={p._id}
                    problem={p.problem}
                    status={p.status}
                    reportedAt={p.reportedAt}
                    type={p.problemType}
                    course={p.course}
                    onRefresh={() => setRefresh(true)}
                  />
                ))
            ) : (
              <div>You have no resolved problems yet.</div>
            )}
          </div>
          <p className="mb-2 text-lg text-gray-600">Resolved Problems</p>
          <div className="grid grid-cols-3 space-x-5">
            {problems.filter((p) => p.status === 'RESOLVED').length > 0 ? (
              problems
                .filter((p) => p.status === 'RESOLVED')
                .map((p) => (
                  <ReportedProblemCard
                    key={p._id}
                    _id={p._id}
                    problem={p.problem}
                    status={p.status}
                    reportedAt={p.reportedAt}
                    type={p.problemType}
                    course={p.course}
                    onRefresh={() => setRefresh(true)}
                  />
                ))
            ) : (
              <div>You have no resolved problems yet.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <img src={NoData} alt="No Problem" className="w-64" />
          <p className="mt-4 text-xl font-medium text-gray-600">
            You have no reported problems yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportedProblems;
