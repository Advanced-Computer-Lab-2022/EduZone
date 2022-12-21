import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import ExerciseView from '../Exercises/ExerciseView';
import GradeView from '../Exercises/GradeView';

declare type LearningMainProps = {
  courseItems: any[];
  currentCourseItem: number;
  enrolled: any;
  score: number;
  onRefresh: () => void;
  courseId: string;
};
const LearningMainContent: React.FC<LearningMainProps> = ({
  courseItems,
  currentCourseItem,
  enrolled,
  score,
  onRefresh,
  courseId,
}) => {
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
  return (
    <div className="overflow-hidden w-full rounded-md">
      {courseItems[currentCourseItem - 1]?.type === 'subtitle' ? (
        <YouTube
          videoId={
            courseItems[currentCourseItem - 1].data?.youtube_url?.split('=')[1]
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
            courseId={courseId}
            onRefresh={onRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default LearningMainContent;
