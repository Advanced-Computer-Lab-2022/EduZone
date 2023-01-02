import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '../../components/common/ProfileCard';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../components/layout/Instructor/InstructorLayout';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';
import Humanize from 'humanize-plus';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { randomBytes } from 'crypto';
import IncomeChart from '../../components/instructor/IncomeChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InstructorDashboard = () => {
  const [stats, setStats] = useState({} as any);
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { conversion_rate, currency } = useSelector(
    (state: RootState) => state.currency
  );

  const getStats = async () => {
    const res = await axios({
      url: `/statistics?view=instructor`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('access-token')}`,
      },
    });
    console.log(res.data);
    setStats(res.data);
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <InstructorLayout>
      {/* <p className="text-2xl mb-2">Hello, {user.name}</p> */}
      <div className="w-full flex gap-5">
        <div className="grow">
          <div className="grid grid-cols-4 gap-5 h-36">
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Courses</p>
              <p className="text-3xl">{stats?.total_courses}</p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Students</p>

              <p className="text-3xl">
                {stats?.enrolled_students?.total}
                {/* <span className="text-base text-gray-400 ml-1">Students</span> */}
              </p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">{moment().format('MMMM')}'s Income</p>
              <p className="text-3xl">
                {Humanize.formatNumber(
                  stats?.income?.data.monthly.find(
                    (i: any) =>
                      i._id.month == new Date().getMonth() + 1 &&
                      i._id.year == new Date().getFullYear()
                  )?.total * conversion_rate || 0,
                  2
                )}
                <span className="text-base text-gray-400 ml-1">{currency}</span>
              </p>
            </div>
            <div className="flex flex-col bg-white rounded-sm shadow p-5">
              <p className="text-xl">Total Earnings</p>
              <p className="text-3xl">
                {Humanize.formatNumber(
                  stats?.income?.total * conversion_rate || 0,
                  2
                )}
                <span className="text-base text-gray-400 ml-1">{currency}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-5 my-5 min-h-[20rem]">
            <IncomeChart income={stats?.income?.data.monthly} />
            <div>
              <p className="text-2xl mb-2"></p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/4 bg-white px-12 py-6 rounded-lg shadow">
          <ProfileCard />
        </div>
      </div>
      {/* <div className="flex my-5">
        <div
          className="w-1/4 h-32 bg-zinc-300 text-primary rounded-md flex justify-center items-center cursor-pointer hover:border border-primary"
          onClick={() => navigate(`/instructor/${id}/courses`)}
        >
          <p className="text-2xl">Courses</p>
        </div>
      </div> */}
    </InstructorLayout>
  );
};

export default InstructorDashboard;
