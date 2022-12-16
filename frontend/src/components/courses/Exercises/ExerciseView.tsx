import { AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Question } from '../../../types/entities/Question';
import { axios } from '../../../utils';
import GradeView from './GradeView';

const ExerciseView: React.FC<{
  exercise: {
    questions: Question[];
    _id: string;
    type: 'finalExam' | 'exercise';
  };
  subtitleId: string;
  courseId: string;
  onRefresh: () => void;
}> = ({ exercise, subtitleId, courseId, onRefresh }) => {
  const [alphabet, setAlphabet] = useState(['a', 'b', 'c', 'd']);
  const [answers, setAnswers] = useState(
    [] as { questionId?: string; answerId?: string }[]
  );

  const onSelectAnswer = (questionId: string, answerId: string) => {
    console.log('Select answer: ', questionId, answerId);
    const newAnswers = answers?.map((answer) => {
      if (answer.questionId === questionId) answer.answerId = answerId;
      return answer;
    });
    setAnswers(newAnswers);
  };

  const onSubmit = async () => {
    // console.log('Submit answers: ', answers);
    // return;
    const url =
      exercise.type === 'finalExam'
        ? `/courses/${courseId}/exam/submit`
        : `/courses/${courseId}/subtitles/${subtitleId}/exercise/${exercise._id}`;
    const res: AxiosResponse<any, any> = await axios({
      url,
      method: 'POST',
      data: { answers },
      headers: {
        Authorization: 'Bearer ' + getCookie('access-token'),
      },
    });
    // console.log(res);
    // alert(res.data?.score);
    onRefresh();
  };

  useEffect(() => {
    if (answers.length === 0 && exercise) {
      exercise.questions?.map((q) => {
        setAnswers((prev) => [...prev, { questionId: q._id }]);
      });
    }
  }, [exercise]);

  return (
    <div>
      {exercise &&
        exercise?.questions?.map((q, index) => (
          <div key={index} className="mb-6">
            <div className="text-lg font-semibold flex gap-3 mb-1">
              <p className="">{index + 1}. </p>
              <p>{q.question}</p>
            </div>
            <div className="space-y-2 mt-3">
              {q?.answers?.map((answer, i2) => (
                <div key={i2} className="mx-8 space-x-2">
                  <input
                    type="radio"
                    name={'answer' + index}
                    id={'sub_' + index + '_answer_' + i2}
                    className="hidden peer"
                    required
                    onChange={(e) =>
                      onSelectAnswer(q?._id?.toString() ?? '', answer._id ?? '')
                    }
                  />
                  <label
                    htmlFor={'sub_' + index + '_answer_' + i2}
                    className="inline-flex justify-between items-center px-5 py-2 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 "
                  >
                    <div className="w-full">
                      {alphabet[i2]}. {answer.answer}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

      <div className="w-full flex justify-end">
        <button
          className="px-4 py-2 bg-primary text-white rounded-md "
          onClick={() => onSubmit()}
        >
          Submit answers
        </button>
      </div>
    </div>
  );
};

export default ExerciseView;
