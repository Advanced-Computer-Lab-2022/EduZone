import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../../components/layout/Admin/AdminLayout';
import { Course } from '../../../../types/entities/Course';
import { axios } from '../../../../utils';
import { Question } from '../../../../types/entities/Question';
import InputField from '../../../../components/common/InputField';
import Divider from '../../../../components/common/Divider';
import LoadingButton from '../../../../components/common/LoadingButton';
import { getCookie } from 'cookies-next';
const InstructorAddCourseExam = () => {
  const [course, setCourse] = useState(undefined as Course | undefined);
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([
    {
      question: '',
      answers: [
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
      ],
    },
  ] as Question[]);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [loadingSave, setLoadingSave] = useState(false);
  const navigate = useNavigate();
  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + courseId,
        method: 'GET',
      });
      setCourse(res.data);
      setQuestions(res.data.finalExam.questions);
      setQuestionsCount(res.data.finalExam.questions.length);
    } catch (error) {
      console.log(error);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        answers: [
          { answer: '', isCorrect: false },
          { answer: '', isCorrect: false },
          { answer: '', isCorrect: false },
          { answer: '', isCorrect: false },
        ],
      },
    ]);
    setQuestionsCount(questionsCount + 1);
  };

  const removeQuestion = () => {
    if (questionsCount > 1) {
      setQuestionsCount(questionsCount - 1);
    }
    setQuestions(questions.slice(0, -1));
  };

  const onSave = async () => {
    setLoadingSave(true);
    console.log({ finalExam: { questions: questions } });
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + courseId + '/exam',
        method: 'POST',
        data: { finalExam: { questions: questions } },
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + getCookie('access-token'),
        },
      });
      console.log(res);
      setLoadingSave(false);
      navigate(-1);
    } catch (error) {
      console.log(error);
      setLoadingSave(false);
    }
  };

  useEffect(() => {
    if (!course) getCourse();
  }, [course]);

  return (
    <AdminLayout>
      <div className="max-w-[80%] mx-auto rounded-md px-6 py-4 bg-white">
        <div className="flex justify-between mb-5 items-center">
          <p className="text-2xl ">{course?.title} Course final Exam</p>
          <LoadingButton
            loading={loadingSave}
            className="bg-green-600  text-white px-4 py-2 rounded-md"
            onClick={onSave}
          >
            Save
          </LoadingButton>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="flex flex-col my-4">
            <label htmlFor={`question-q-${index + 1}`}>
              Question {index + 1}
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-2"
              placeholder="Enter your question here"
              name={`question-q-${index + 1}`}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const newQuestions = [...questions];
                newQuestions[index].question = input.value;
                setQuestions(newQuestions);
              }}
              value={question.question}
            />
            <div className="grid grid-cols-2 gap-3">
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex  ">
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-2"
                    placeholder="Enter your answer here"
                    name={`answer-q-${index + 1}-a-${answerIndex + 1}`}
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const newQuestions = [...questions];
                      newQuestions[index].answers[answerIndex].answer =
                        input.value;
                      setQuestions(newQuestions);
                    }}
                    value={answer.answer}
                  />
                  <div className="flex flex-col items-center w-2/12 justify-center">
                    <input
                      required
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      name={`answer-q-${index + 1}-a-correct`}
                      value={answerIndex}
                      onChange={(e) => {
                        const input = e.target as HTMLInputElement;
                        const newQuestions = [...questions];
                        //set all isCorrect to false
                        newQuestions[index].answers.forEach(
                          (answer) => (answer.isCorrect = false)
                        );
                        newQuestions[index].answers[answerIndex].isCorrect =
                          input.value === answerIndex.toString();
                        setQuestions(newQuestions);
                      }}
                      checked={answer.isCorrect}
                    />
                    <p className="ml-2 text-sm">Is correct</p>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        ))}
        <div className="flex justify-center gap-4">
          <div
            className="bg-gray-400  px-4 text-white text-lg py-2 text-center rounded-md my-2 cursor-pointer"
            onClick={() => removeQuestion()}
          >
            - Remove last question
          </div>
          <div
            className=" px-4 bg-blue-600  text-white text-lg py-2 text-center rounded-md my-2 cursor-pointer"
            onClick={() => addQuestion()}
          >
            + Add Question
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorAddCourseExam;
