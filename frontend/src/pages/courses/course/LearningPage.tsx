import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import IconText from '../../../components/common/IconText';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import {
  BsArrowRightShort,
  BsArrowLeftShort,
  BsFileEarmarkText,
  BsPencilSquare,
  BsPlayFill,
} from 'react-icons/bs';
import { Subtitle } from '../../../types/entities/Subtitle';
import ExerciseView from '../../../components/courses/Exercises/ExerciseView';
import GradeView from '../../../components/courses/Exercises/GradeView';
import { getCookie } from 'cookies-next';
import CourseItemsNav from '../../../components/courses/CourseItemsNav';
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

  const completeItem = async (
    item: 'exercise' | 'subtitle' | 'finalExam',
    itemId: string
  ) => {
    const res = await axios({
      url: '/courses/' + id + '/complete?item=' + item + '&itemId=' + itemId,
      method: 'PATCH',
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getCookie('access-token'),
      },
    });
    setCourse(res.data);
    setRefresh(true);
  };

  const finishCourse = async () => {
    const res = await axios({
      url: '/courses/' + id + '/finish',
      method: 'PATCH',
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getCookie('access-token'),
      },
    });
    setCourse(res.data);
    setRefresh(true);
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
  const [progress, setProgress] = useState(0);

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

    setProgress(
      ((course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.completed
        ?.exercises?.length +
        course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.completed
          ?.subtitles?.length +
        (course?.enrolled?.find((e: any) => e?.studentId === user?.id)
          ?.completed?.finalExam
          ? 1
          : 0)) /
        courseItems.length) *
        100
    );

    if (
      (!course?.enrolled?.find((e: any) => e?.studentId === user?.id)
        ?.finished &&
        progress === 100 &&
        course?.enrolled?.find((e: any) => e?.studentId === user?.id)?.finalExam
          ?.score) ??
      0 > 50
    ) {
      finishCourse();
    }
    if ((score === -1 && enrolled) || refresh) {
      // setScore(
      //   course?.enrolled
      //     ?.find((e: any) => e?.studentId === user?.id)
      //     ?.exercises.find(
      //       (e: any) =>
      //         e.exerciseId ===
      //         courseItems[currentCourseItem - 1]?.data?._id.toString()
      //     )?.score
      // );

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
  const nextItem = () => {
    setScore(-1);
    if (currentCourseItem < courseItems.length)
      setCurrentCourseItem(currentCourseItem + 1);
  };
  const prevItem = () => {
    setScore(-1);
    if (currentCourseItem > 1) setCurrentCourseItem(currentCourseItem - 1);
  };

  const onClickItem = (index: number) => {
    setCurrentCourseItem(index + 1);
    setScore(-1);
  };
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
              <Link to={'/courses/' + course?._id}>
                <p className="text-gray-600 font-medium -mt-1 hover:text-primary">
                  {course?.title}
                </p>
              </Link>
            </div>
            {courseItems[currentCourseItem - 1]?.type === 'subtitle' &&
              !enrolled?.completed?.subtitles?.includes(
                courseItems[currentCourseItem - 1]?.data._id
              ) && (
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 text-white bg-green-600 rounded-md"
                    onClick={() => {
                      completeItem(
                        courseItems[currentCourseItem - 1]?.type,
                        courseItems[currentCourseItem - 1]?.data._id
                      );
                    }}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
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
                  enrolled?.finalExam) &&
                  score > -1 && <GradeView score={score} />}

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
        {/* HERE */}
        <CourseItemsNav
          nextItem={nextItem}
          prevItem={prevItem}
          courseItems={courseItems}
          currentCourseItem={currentCourseItem}
          onClickItem={onClickItem}
          enrolled={enrolled}
          progress={progress}
        />
      </div>
    </Layout>
  );
};

export default LearningPage;
