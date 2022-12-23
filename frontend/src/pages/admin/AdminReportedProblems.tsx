import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { MdReportProblem } from 'react-icons/md';
import AdminReportedProblemCard from '../../components/courses/AdminReportedProblemCard';
import ReportedProblemCard from '../../components/courses/ReportedProblemCard';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { axios } from '../../utils';

const AdminReportedProblems = () => {
  //  const { id } = useSelector((state: RootState) => state.auth.user);
  const [problems, setProblems] = useState([] as any[]);
  const getReportedProblems = async () => {
    const res = await axios({
      url: `/courses/problems`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    const data: any = [];
    res.data.map((p: any) => {
      p.problems.map((problem: any) => {
        data.push({
          ...problem,
          course: p.course,
        });
      });
    });
    console.log(data);
    setProblems(data);
  };

  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (problems.length === 0) getReportedProblems();
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const handleMarkAs = async (
    courseId: string,
    userId: string,
    id: string,
    status: string
  ) => {
    const res = await axios({
      url: `/courses/${courseId}/problems/${id}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        userId,
        status,
      },
    });
    const newProblems = problems.map((p) => {
      if (p._id === id) {
        return res.data;
      }
      return p;
    });
    setProblems(newProblems);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="my-5 text-2xl font-medium text-gray-700 flex items-center gap-2">
          <MdReportProblem />
          <p> Reported Problems</p>
        </h1>

        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Problem Reported
                </th>
                <th scope="col" className="py-3 px-6">
                  Type
                </th>
                <th scope="col" className="py-3 px-6">
                  Course
                </th>
                <th scope="col" className="py-3 px-6">
                  User
                </th>
                <th scope="col" className="py-3 px-6">
                  Reported at
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                <th scope="col" className="py-3 px-6">
                  {/* <span className="sr-only">Edit</span>
                   */}
                  Mark as
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map(
                ({
                  _id,
                  problem,
                  status,
                  reportedAt,
                  course,
                  user,
                  problemType,
                }) => (
                  <tr
                    className="bg-white border-b  hover:bg-gray-50 "
                    key={_id}
                  >
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 w-1/3 "
                    >
                      <div className="flex break-normal	 flex-col">
                        <p>
                          {problem} Lorem Ipsum is simply dummy text of the
                          printing and typesetting industry.
                        </p>
                      </div>
                    </th>
                    <td className="py-4 px-6 uppercase">{problemType}</td>
                    <td className="py-4 px-6">{course.title}</td>
                    <td className="py-4 px-6">
                      {user.name} ({user.role})
                    </td>
                    <td className="py-4 px-6">
                      {moment(new Date(reportedAt)).fromNow()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : status === 'RESOLVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6 space-x-2">
                      {status !== 'RESOLVED' && (
                        <button
                          className="px-3 py-2 rounded-md font-medium bg-green-600 text-white"
                          onClick={() =>
                            handleMarkAs(
                              course._id,
                              user._id.toString(),
                              _id.toString(),
                              'RESOLVED'
                            )
                          }
                        >
                          Resolve
                        </button>
                      )}
                      {status === 'UNSEEN' && (
                        <button
                          className="px-3 py-2 rounded-md font-medium bg-orange-600 text-white"
                          onClick={() =>
                            handleMarkAs(
                              course._id,
                              user._id.toString(),
                              _id.toString(),
                              'PENDING'
                            )
                          }
                        >
                          Pending
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/* 
        {problems.length > 0 ? (
          <div className="my-4">
            <p className="mb-2 text-lg text-gray-600">Unseen Problems</p>
            <div className="grid grid-cols-4 mb-6">
              {problems.filter((p) => p.status === 'UNSEEN').length > 0 ? (
                problems
                  .filter((p) => p.status === 'UNSEEN')
                  .map((p) => (
                    <AdminReportedProblemCard
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
            <div className="grid grid-cols-3  mb-6">
              {problems.filter((p) => p.status === 'PENDING').length > 0 ? (
                problems
                  .filter((p) => p.status === 'PENDING')
                  .map((p) => (
                    <AdminReportedProblemCard
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
            <div className="grid grid-cols-3">
              {problems.filter((p) => p.status === 'RESOLVED').length > 0 ? (
                problems
                  .filter((p) => p.status === 'RESOLVED')
                  .map((p) => (
                    <AdminReportedProblemCard
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
          <div>You have no reported problems.</div>
        )} */}
      </div>
    </AdminLayout>
  );
};

export default AdminReportedProblems;
/**
 *
  return (
   
  );
 */
