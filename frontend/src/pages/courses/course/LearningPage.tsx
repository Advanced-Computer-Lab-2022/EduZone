import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import IconText from '../../../components/common/IconText';
import Layout from '../../../components/layout/Trainee/Layout';
import { RootState } from '../../../redux/store';
import { axios } from '../../../utils';
import { debounce } from 'lodash';

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
import LearningHeader from '../../../components/courses/Learning/LearningHeader';
import LearningMainContent from '../../../components/courses/Learning/LearningMainContent';
import SubtitleNote from './SubtitleNote';
const LearningPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [subtitleNumber, setSubtitleNumber] = useState(1);
  const [subtitles, setSubtitles] = useState([] as Subtitle[]);
  const [enrolled, setEnrolled] = useState(null as any);
  const [currentSubtitle, setCurrentSubtitle] = useState(
    undefined as Subtitle | undefined
  );
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

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

      setInitialNotes('');
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
  const [initialNotes, setInitialNotes] = useState('');

  useEffect(() => {
    if (!course && !refresh) {
      getCourse();
    }

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

    setNotes(
      course?.enrolled
        ?.find((e: any) => e?.studentId === user?.id)
        ?.notes.find(
          (n: any) =>
            n.subtitleId === courseItems[currentCourseItem - 1]?.data._id
        )?.notes
    );
    if (initialNotes === '') {
      setInitialNotes(
        course?.enrolled
          ?.find((e: any) => e?.studentId === user?.id)
          ?.notes.find(
            (n: any) =>
              n.subtitleId === courseItems[currentCourseItem - 1]?.data._id
          )?.notes
      );
    }

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

  const nextItem = () => {
    setInitialNotes('');
    setScore(-1);
    if (currentCourseItem < courseItems.length)
      setCurrentCourseItem(currentCourseItem + 1);
  };
  const prevItem = () => {
    setInitialNotes('');
    setScore(-1);
    if (currentCourseItem > 1) setCurrentCourseItem(currentCourseItem - 1);
  };

  const onClickItem = (index: number) => {
    setInitialNotes('');
    setCurrentCourseItem(index + 1);
    setScore(-1);
  };

  const onChangeNote = (e: string) => {
    setNotes(e);
  };

  const saveNote = async () => {
    const res = await axios({
      url:
        '/courses/' +
        id +
        '/subtitles/' +
        courseItems[currentCourseItem - 1]?.data._id +
        '/notes',
      method: 'PUT',
      data: {
        notes,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getCookie('access-token'),
      },
    });
    setCourse(res.data);
    setInitialNotes(notes);
    setRefresh(true);
  };

  const onUpdateCourse = (course: any) => {
    setCourse(course);
  };

  return (
    <Layout>
      <div className="grid grid-cols-3">
        <div className="col-span-2 my-2 space-y-4 w-[95%]">
          <LearningHeader
            onMarkCompleted={completeItem}
            courseItems={courseItems}
            currentCourseItem={currentCourseItem}
            enrolled={enrolled}
            title={course?.title}
            courseId={course?._id}
          />

          <LearningMainContent
            courseItems={courseItems}
            currentCourseItem={currentCourseItem}
            enrolled={enrolled}
            score={score}
            onRefresh={() => {
              getCourse();
              setRefresh(true);
            }}
            courseId={course?._id}
          />
          {courseItems[currentCourseItem - 1]?.type === 'subtitle' && (
            <SubtitleNote
              initialNote={initialNotes ?? ''}
              onChangeNote={onChangeNote}
              onSaveNote={saveNote}
              saved={initialNotes === notes}
            />
          )}
        </div>
        <CourseItemsNav
          nextItem={nextItem}
          prevItem={prevItem}
          courseItems={courseItems}
          currentCourseItem={currentCourseItem}
          onClickItem={onClickItem}
          enrolled={enrolled}
          progress={progress}
          onUpdateCourse={onUpdateCourse}
        />
      </div>
    </Layout>
  );
};

export default LearningPage;
