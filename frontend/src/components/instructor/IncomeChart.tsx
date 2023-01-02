import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
const IncomeChart: React.FC<{ income: any }> = ({ income }) => {
  const { conversion_rate, currency } = useSelector(
    (state: RootState) => state.currency
  );
  const [chartTitle, setChartTitle] = useState('Monthly Income');
  const [displayType, setDisplayType] = useState('year');
  const [year, setYear] = useState(new Date().getFullYear());
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };

  const [labels, setLabels] = useState(months);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };
  const data = {
    labels: Object.values(labels),
    datasets: [
      {
        label: 'Income',
        data: Object.entries(labels).map(
          ([key, value]) =>
            income?.find(
              (i: any) => i._id.month == Number(key) + 1 && i._id.year == year
            )?.total * conversion_rate ?? 0
        ),
        backgroundColor: '#5087cd',
        borderColor: '#5087cd',
      },
    ],
  };

  return (
    <div className="flex flex-col bg-white rounded-sm shadow p-5">
      <div className="flex gap-2 justify-end">
        <button onClick={() => setYear(year - 1)}>
          <FiChevronLeft />
        </button>
        <p className="text-sm font-sans">{year}</p>
        <button onClick={() => setYear(year + 1)}>
          <FiChevronRight />
        </button>
      </div>

      <Line options={options} data={data} />
    </div>
  );
};

export default IncomeChart;
