import React from 'react';

const GradeView: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between  border rounded-md  p-4 ${
          score >= 75
            ? 'border-green-600 text-green-700 bg-green-500/20'
            : score >= 50
            ? 'border-yellow-600 text-yellow-700 bg-yellow-500/20'
            : 'border-red-600 text-red-700 bg-red-500/20'
        }  w-full mb-4`}
      >
        <p>
          You have submitted your answer successfully
          <p className="text-sm">
            You can review your answers below.{' '}
            {score < 50 && (
              <span className="underline hover:font-semibold cursor-pointer">
                Retake the exercise
              </span>
            )}
          </p>
        </p>
        <div className="flex flex-col">
          <p>Your Score:</p>
          <p className={'text-xl font-semibold'}>
            <span className="font-bold">{score}% - </span>
            {score >= 50 ? 'PASSED' : 'FAILED'}
          </p>
        </div>
      </div>
      {score > -1 ? (
        <div className="flex w-full justify-end gap-2 text-sm mb-3">
          {score < 100 && (
            <button className="hover:underline text-gray-600 pr-2 border-r-2 border-gray-400">
              View Correct Answers
            </button>
          )}
          {score < 50 && (
            <button className="hover:underline text-gray-600">
              {' '}
              Retake the exercise
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default GradeView;
