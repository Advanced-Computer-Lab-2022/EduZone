import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import Divider from '../../../../components/common/Divider';
import LoadingButton from '../../../../components/common/LoadingButton';
import AdminLayout from '../../../../components/layout/Admin/AdminLayout';
import { Question } from '../../../../types/entities/Question';
import { Subtitle } from '../../../../types/entities/Subtitle';
import { axios } from '../../../../utils';
import { TiTick } from 'react-icons/ti';
const InstructorSubtitlePage = () => {
  const { courseId, subtitleId } = useParams();
  const [subtitle, setSubtitle] = useState(undefined as Subtitle | undefined);
  const [editingExercises, setEditingExercises] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [exerciseQuestionsCount, setExerciseQuestionsCount] = useState(1);
  const [exerciseQuestions, setExerciseQuestions] = useState([
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

  const getSubtitle = async () => {
    try {
      const res = await axios({
        url: `/courses/${courseId}/subtitles/${subtitleId}`,
        method: 'GET',
      });
      console.log(res.data);
      setSubtitle(res.data);
      setExerciseQuestions(res.data.exercise.questions);
      setExerciseQuestionsCount(res.data.exercise.questions.length);
    } catch (error) {
      console.log(error);
    }
  };

  const addQuestion = () => {
    setExerciseQuestions([
      ...exerciseQuestions,
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
    setExerciseQuestionsCount(exerciseQuestionsCount + 1);
  };

  const removeQuestion = () => {
    if (exerciseQuestionsCount > 1) {
      setExerciseQuestionsCount(exerciseQuestionsCount - 1);
    }
    setExerciseQuestions(exerciseQuestions.slice(0, -1));
  };

  const saveSubtitle = async () => {
    setLoadingSave(true);
    ///:id/subtitles/:subtitleId/exercise
    try {
      const res = await axios({
        url: `/courses/${courseId}/subtitles/${subtitleId}/exercise`,
        method: 'POST',
        data: {
          exercise: {
            questions: exerciseQuestions,
          },
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access-token')}`,
        },
      });
      console.log(res.data);
      setSubtitle(res.data);
      setEditingExercises(false);
    } catch (error) {
      console.log(error);
    }
    setLoadingSave(false);
  };

  useEffect(() => {
    if (!subtitle) getSubtitle();
  }, []);

  return (
    <AdminLayout>
      <div className="container grid grid-cols-2 space-x-8">
        <div>
          <div>
            <h1 className="text-4xl font-medium">
              {subtitle?.order}. {subtitle?.title}
            </h1>
            <p className="text-sm">
              <span className="text-gray-500">Duration: </span>
              {subtitle?.duration}
              {' hrs'}
            </p>
            <p className="text-gray-500 mt-2">{subtitle?.description}</p>
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-start mt-6">
              <h1 className="text-2xl font-medium ">Subtitle Exercise</h1>
              <div>
                {editingExercises ? (
                  <LoadingButton
                    loading={loadingSave}
                    className="px-4 py-2 rounded-md"
                    onClick={saveSubtitle}
                  >
                    Save
                  </LoadingButton>
                ) : (
                  <button
                    className="text-white px-4 py-2 rounded-md bg-primary"
                    onClick={() => setEditingExercises(true)}
                  >
                    {subtitle?.exercise ? 'Edit Exercise' : 'Add Exercise'}
                  </button>
                )}
              </div>
            </div>
            {editingExercises ? (
              <div className="mt-4">
                {exerciseQuestions.map((question, index) => (
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
                        const newQuestions = [...exerciseQuestions];
                        newQuestions[index].question = input.value;
                        setExerciseQuestions(newQuestions);
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
                              const newQuestions = [...exerciseQuestions];
                              newQuestions[index].answers[answerIndex].answer =
                                input.value;
                              setExerciseQuestions(newQuestions);
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
                                const newQuestions = [...exerciseQuestions];
                                //set all isCorrect to false
                                newQuestions[index].answers.forEach(
                                  (answer) => (answer.isCorrect = false)
                                );
                                newQuestions[index].answers[
                                  answerIndex
                                ].isCorrect =
                                  input.value === answerIndex.toString();
                                setExerciseQuestions(newQuestions);
                              }}
                              checked={answer.isCorrect}
                            />
                            <p className="ml-2 text-sm">correct</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Divider />
                  </div>
                ))}
                <div className="flex justify-center gap-4 text-sm">
                  <div
                    className="bg-gray-400  px-4 text-white  py-2 text-center rounded-md my-2 cursor-pointer"
                    onClick={() => removeQuestion()}
                  >
                    - Remove last question
                  </div>
                  <div
                    className=" px-4 bg-blue-600  text-white  py-2 text-center rounded-md my-2 cursor-pointer"
                    onClick={() => addQuestion()}
                  >
                    + Add Question
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {subtitle?.exercise?.questions.map((question, index) => (
                  <div key={index} className="">
                    <p className="font-medium my-2">
                      <span className="text-gray-500">
                        Question {index + 1}:{' '}
                      </span>
                      {question.question}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {question.answers.map(
                        (answer: any, answerIndex: number) => (
                          <div className="flex gap-2 items-center">
                            <p>
                              {answerIndex + 1}
                              {'-'}
                              {answer.answer}
                            </p>
                            {answer.isCorrect && (
                              <span className="text-green-600">
                                <TiTick size={25} />
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-medium mt-4">Lessons</h1>
          <div className="mt-2 overflow-hidden">
            {/* TODO: when adding multiple lessons change this to a loop and add accordion */}
            <YouTube videoId={subtitle?.youtube_url?.split('v=')[1]} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorSubtitlePage;
