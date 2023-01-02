import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useState } from 'react';
import { axios } from '../../utils';
import Modal from '../common/Modal';

declare type AdminReportedProblemProps = {
  _id: string;
  problem: string;
  status: string;
  reportedAt: string;
  type: string;
  course: { _id: string; title: string };
  onRefresh: () => void;
  followup?: string;
};

const AdminReportedProblemCard: React.FC<AdminReportedProblemProps> = ({
  _id,
  problem,
  status,
  reportedAt,
  type,
  course,
  followup,
  onRefresh,
}) => {
  const sendFollowup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const followup = (e.target as HTMLFormElement).followup.value;
    const res = await axios({
      url: `/courses/${course._id}/problems/${_id}/followup`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
      data: {
        followup,
      },
    });
    console.log(res);
    if (res.status === 202) {
      setFollowUpOopen(false);
      onRefresh();
    }
  };

  const [followUpOopen, setFollowUpOopen] = useState(false);
  return (
    <div>
      <div
        className={`${
          status === 'UNRESOLVED'
            ? 'bg-red-400/30  border-red-400'
            : status === 'PENDING'
            ? 'bg-orange-500/30  border-orange-500'
            : 'bg-green-400/30  border-green-500'
        } shadow-md border p-4 rounded-lg flex flex-col`}
      >
        <div className="flex justify-between items">
          <p className="text-sm">{(type ?? '').toUpperCase()}</p>
          <p className="text-sm text-gray-700">
            {moment(new Date(reportedAt)).fromNow()}
          </p>
        </div>
        <h3 className="font-semibold">{status}</h3>
        <p className="text-sm mb-2">
          <span className="font-semibold">Course: </span>
          {course.title}
        </p>
        <p>Problem: {problem}</p>
        <p>Followup: {followup ?? 'None'}</p>
      </div>
    </div>
  );
};

export default AdminReportedProblemCard;
