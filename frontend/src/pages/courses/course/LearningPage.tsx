import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import IconText from '../../../components/common/IconText';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import { BsArrowRightShort, BsArrowLeftShort } from 'react-icons/bs';
import { Subtitle } from '../../../types/entities/Subtitle';
import ExerciseView from '../../../components/courses/Exercises/ExerciseView';
import GradeView from '../../../components/courses/Exercises/GradeView';
const LearningPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [subtitleNumber, setSubtitleNumber] = useState(1);
  const [subtitles, setSubtitles] = useState([] as Subtitle[]);
  const [enrolled, setEnrolled] = useState(null as any);
  const [currentSubtitle, setCurrentSubtitle] = useState(
    undefined as Subtitle | undefined
  );
  const navigate = useNavigate();
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '500',
    playerVars: {
      autoplay: 0,
      muted: 0,
    },
  };

  const getCourse = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios({
        url: '/courses/' + id,
        method: 'GET',
      });
      setCourse(res.data);
      setSubtitles(res.data.subtitles);
      setCurrentSubtitle(res.data.subtitles[0]);

      setCourseItems([]);
      res.data.subtitles.map((s: Subtitle) => {
        setCourseItems((prev) => [
          ...prev,
          {
            type: 'subtitle',
            data: s,
          },
        ]);
        if (s.exercise) {
          setCourseItems((prev) => [
            ...prev,
            {
              type: 'exercise',
              data: s.exercise,
            },
          ]);
        }
      });
      if (res.data?.finalExam) {
        setCourseItems((prev) => [
          ...prev,
          {
            type: 'finalExam',
            data: res.data.finalExam,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  const [courseItems, setCourseItems] = useState([] as any[]);
  const [currentCourseItem, setCurrentCourseItem] = useState(1);
  const [score, setScore] = useState(-1);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!course && !refresh) {
      getCourse();
    }
    // setCurrentSubtitle(
    //   subtitles.find((s: Subtitle) => s.order === subtitleNumber)
    // );
    if (enrolled === null || !enrolled || refresh)
      setEnrolled(
        course?.enrolled?.find((e: any) => e?.studentId === user?.id)
      );
    // setScore(
    //   course?.enrolled
    //     ?.find((e: any) => e?.studentId === user?.id)
    //     ?.exercises.find(
    //       (e: any) =>
    //         e.exerciseId ===
    //         courseItems[currentCourseItem - 1]?.data?._id.toString()
    //     )?.score
    // );
    if ((score === -1 && enrolled) || refresh) {
      if (courseItems[currentCourseItem - 1]?.type === 'exercise') {
        setScore(
          enrolled?.exercises.find(
            (e: any) =>
              e.exerciseId ===
              courseItems[currentCourseItem - 1]?.data?._id.toString()
          )?.score ?? -1
        );
      } else if (courseItems[currentCourseItem - 1]?.type === 'finalExam') {
        setScore(enrolled?.finalExam?.score ?? -1);
        console.log(enrolled?.finalExam?.score);
      }
    }
    setRefresh(false);
  }, [course, enrolled, currentCourseItem]);

  // console.log(enrolled);
  // console.log(courseItems[currentCourseItem - 1]?.data?._id);
  // console.log(
  //   enrolled?.exercises.find(
  //     (e: any) =>
  //       e.exerciseId ===
  //       courseItems[currentCourseItem - 1]?.data?._id.toString()
  //   )?.score
  // );
  return (
    <Layout>
      <div className="grid grid-cols-3">
        <div className="col-span-2 my-2 space-y-4 w-[95%]">
          <div className="flex items-center justify-between ">
            <div>
              <span className="text-2xl font-medium">
                {courseItems[currentCourseItem - 1]?.type === 'subtitle'
                  ? courseItems[currentCourseItem - 1]?.data.title
                  : `Exercise: ${
                      courseItems[currentCourseItem - 2]?.data.title
                    }`}
              </span>
              <p className="text-gray-600 font-medium -mt-1">{course?.title}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-white bg-green-600 rounded-md">
                Complete
              </button>
            </div>
          </div>

          <div className="overflow-hidden w-full rounded-md">
            {courseItems[currentCourseItem - 1]?.type === 'subtitle' ? (
              <YouTube
                videoId={
                  courseItems[currentCourseItem - 1].data?.youtube_url?.split(
                    '='
                  )[1]
                }
                opts={opts}
                onReady={onPlayerReady}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-md  p-6">
                {(enrolled?.exercises.find(
                  (e: any) =>
                    e.exerciseId ===
                    courseItems[currentCourseItem - 1]?.data?._id.toString()
                ) ||
                  enrolled?.finalExam) && <GradeView score={score} />}

                <ExerciseView
                  exercise={{
                    ...courseItems[currentCourseItem - 1]?.data,
                    type: courseItems[currentCourseItem - 1]?.type,
                  }}
                  subtitleId={courseItems[currentCourseItem - 2]?.data?._id}
                  courseId={course?._id}
                  onRefresh={() => {
                    getCourse();
                    setRefresh(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col mt-4">
            <div className="flex justify-between -mx-4 ">
              <button className="cursor-pointer hover:text-primary">
                <IconText
                  text={'Previous'}
                  leading={<BsArrowLeftShort size={25} />}
                  onClick={() => {
                    setScore(-1);
                    return currentCourseItem > 1
                      ? setCurrentCourseItem(currentCourseItem - 1)
                      : null;
                  }}
                />
              </button>
              <button className="cursor-pointer hover:text-primary">
                <IconText
                  text={'Next'}
                  trailing={<BsArrowRightShort size={25} />}
                  onClick={() => {
                    setScore(-1);
                    return currentCourseItem < courseItems.length
                      ? setCurrentCourseItem(currentCourseItem + 1)
                      : null;
                  }}
                />
              </button>
            </div>

            {courseItems?.map((item, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 my-1 border border-gray-300 rounded-md cursor-pointer  ${
                  currentCourseItem === index + 1
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentCourseItem(index + 1);
                  setScore(-1);
                }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-semibold">
                      {item.type === 'subtitle'
                        ? item.data.title
                        : item.type === 'exercise'
                        ? `Exercise: ${courseItems[index - 1].data.title}`
                        : 'Final Exam'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.type === 'subtitle' ? item.data.duration : `5 mins`}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* <div
              className={`flex items-center justify-between p-2 my-1 border border-gray-300 rounded-md cursor-pointer `}
              onClick={() => setCurrentCourseItem(courseItems.length)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="ml-2">
                  <p className="text-sm font-semibold">Final Exam</p>
                  <p className="text-xs text-gray-500">15 mins</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearningPage;
