import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { HiReceiptRefund } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

const AdminRefundRequests = () => {
  const [requests, setRequests] = useState([] as any[]);
  const [filteredRequests, setFilteredRequests] = useState([] as any[]);

  const [selectedStatus, setSelectedStatus] = useState('all');
  const getRequests = async () => {
    const res = await axios({
      url: `/courses/refund-requests`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    setRequests(res.data);
    setFilteredRequests(res.data);
  };
  const { currency, conversion_rate } = useSelector(
    (state: RootState) => state.currency
  );
  useEffect(() => {
    if (requests.length === 0) getRequests();
    else {
      if (selectedStatus === 'all') setFilteredRequests(requests);
      else {
        const filtered = requests.filter(
          (request) => request.status === selectedStatus
        );
        setFilteredRequests(filtered);
      }
    }
  }, [selectedStatus]);

  const handleRequest = async (
    courseId: string,
    studentId: string,
    requestId: string,
    status: string,
    amount: number
  ) => {
    const res = await axios({
      url: `/courses/refund-requests/${requestId}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        status,
        amount,
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
    setFilteredRequests(newRequests);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between">
          <h1 className="my-5 text-2xl font-medium text-gray-700 flex items-center gap-2">
            <HiReceiptRefund />
            <p> Refund Requests</p> ({filteredRequests.length})
          </h1>

          <div className="flex items-center gap-2">
            <p className="text-gray-700">Filter by status:</p>
            <select
              className="px-3 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

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
                  Original Price
                </th>
                <th scope="col" className="py-3 px-6">
                  W/ Discount
                </th>
                <th scope="col" className="py-3 px-6">
                  Refund Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  Requested at
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>

                <th scope="col" className="py-3 px-6" align="center">
                  {/* <span className="sr-only">Edit</span>
                   */}
                  Resolve
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests?.map((request) => {
                const amount_paid =
                  request?.amount ||
                  request?.course.enrolled?.find(
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
                      )}{' '}
                      {currency}
                    </td>
                    <td className="py-4 px-6">
                      {amount_paid !== request?.course.price ? 'YES' : 'NO'}
                    </td>
                    <td className="py-4 px-6">
                      {Number(amount_paid * conversion_rate).toFixed(2)}{' '}
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
                                'ACCEPTED',
                                amount_paid
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
                                'REJECTED',
                                amount_paid
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

export default AdminRefundRequests;
