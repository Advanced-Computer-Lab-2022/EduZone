import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { HiReceiptRefund } from 'react-icons/hi';
import { MdReportProblem } from 'react-icons/md';
import { TbLockAccess } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

const AdminCourseAccessRequest = () => {
  const [requests, setRequests] = useState([] as any[]);

  const getRequests = async () => {
    const res = await axios({
      url: `/courses/access-requests`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    setRequests(res.data);
  };
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  useEffect(() => {
    if (requests.length === 0) getRequests();
  }, []);

  const handleRequest = async (
    courseId: string,
    studentId: string,
    requestId: string,
    status: string
  ) => {
    const res = await axios({
      url: `/courses/access-requests/${requestId}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        status,
        courseId,
        studentId,
      },
    });
    console.log(res.data);
    const newRequests = requests.map((request) => {
      if (request._id === requestId) return res.data;
      return request;
    });
    setRequests(newRequests);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="my-5 text-2xl font-medium text-gray-700 flex items-center gap-2">
          <TbLockAccess size={30} />
          <p>Course Access Requests</p> ({requests.length})
        </h1>

        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Course
                </th>
                <th scope="col" className="py-3 px-6">
                  Student
                </th>
                <th scope="col" className="py-3 px-6">
                  Course Price
                </th>
                <th scope="col" className="py-3 px-6">
                  Requested at
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>

                <th scope="col" className="py-3 px-6" align="center">
                  Resolve
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const amount_paid = request?.course.enrolled?.find(
                  (e: any) => e.studentId === request.student._id
                )?.payment.amount;
                return (
                  <tr
                    className="bg-white border-b  hover:bg-gray-50 "
                    key={request?._id}
                  >
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900  "
                    >
                      <div className="flex break-normal	 flex-col">
                        <p>{request?.course?.title}</p>
                      </div>
                    </th>
                    <td className="py-4 px-6 uppercase">
                      {request?.student?.name}
                    </td>
                    <td className="py-4 px-6">
                      {Number(request?.course?.price * conversion_rate).toFixed(
                        2
                      )}
                      {currency}
                    </td>
                    <td className="py-4 px-6">
                      {moment(new Date(request.requestedAt)).fromNow()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 " align="center">
                      {request?.status === 'PENDING' ? (
                        <div className="space-x-2">
                          <button
                            className="px-3 py-2 rounded-md font-medium bg-green-600 text-white uppercase"
                            onClick={() =>
                              handleRequest(
                                request?.course._id,
                                request?.student._id,
                                request?._id,
                                'ACCEPTED'
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="px-3 py-2 rounded-md font-medium bg-red-600 text-white uppercase"
                            onClick={() =>
                              handleRequest(
                                request?.course._id,
                                request?.student._id,
                                request?._id,
                                'REJECTED'
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-400 uppercase">Resolved</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourseAccessRequest;
