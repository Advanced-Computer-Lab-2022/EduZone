import { getCookie } from 'cookies-next';
import moment from 'moment';
import React, { useState } from 'react';
import { axios } from '../../utils';
import Modal from '../common/Modal';

declare type ReportedProblemProps = {
  _id: string;
  problem: string;
  status: string;
  reportedAt: string;
  type: string;
  course: { _id: string; title: string };
  onRefresh: () => void;
  followup?: string;
};

const ReportedProblemCard: React.FC<ReportedProblemProps> = ({
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
      <Modal
        open={followUpOopen}
        close={() => setFollowUpOopen(false)}
        title="Follow up"
      >
        <div className="px-3">
          <div className="mb-6">
            <div className={'flex justify-between mb-1'}>
              <p className="">Type: {(type ?? '').toUpperCase()}</p>
              <p className="text-gray-700 text-sm">
                Reported {moment(new Date(reportedAt)).fromNow()}
              </p>
            </div>
            <p>
              <span className="font-semibold">Problem: </span>
              {problem}
            </p>
          </div>

          <form onSubmit={sendFollowup}>
            <label htmlFor="followup" className="">
              Follow up message
            </label>
            <textarea
              name="followup"
              id=""
              cols={30}
              rows={5}
              className="w-full p-4 border rounded-md"
              placeholder="Write your follow up"
            ></textarea>
            <div className="w-full flex justify-end">
              <button className="bg-primary text-white px-4 py-2 rounded-md mt-4 ">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>
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

        {status !== 'RESOLVED' ? (
          <button
            className={
              'ml-auto mt-2 text-sm text-red-900 hover:underline font-medium'
            }
            onClick={() => setFollowUpOopen(true)}
          >
            Follow up
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ReportedProblemCard;
