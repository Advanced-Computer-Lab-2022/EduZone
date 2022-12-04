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
const LearningPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(undefined as any | undefined);
  const [subtitleNumber, setSubtitleNumber] = useState(1);
  const [subtitles, setSubtitles] = useState([] as Subtitle[]);
  const [currentSubtitle, setCurrentSubtitle] = useState(
    undefined as Subtitle | undefined
  );
  const navigate = useNavigate();
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    width: '95%',
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
    } catch (error) {
      console.log(error);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!course) getCourse();
    setCurrentSubtitle(
      subtitles.find((s: Subtitle) => s.order === subtitleNumber)
    );
  }, [course, subtitleNumber]);
  return (
    <Layout>
      <div className="grid grid-cols-3">
        <div className="col-span-2 my-2 space-y-4">
          <div>
            <span className="text-2xl font-medium">
              {currentSubtitle?.title}
            </span>
            <p className="text-gray-600 font-medium -mt-1">{course?.title}</p>
          </div>

          <div className="overflow-hidden w-full rounded-md">
            <YouTube
              videoId={currentSubtitle?.youtube_url?.split('=')[1]}
              opts={opts}
              onReady={onPlayerReady}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col mt-4">
            <div className="flex justify-between -mx-4 ">
              {/* Next and prev */}

              <button className="cursor-pointer hover:text-primary">
                <IconText
                  text={'Previous'}
                  leading={<BsArrowLeftShort size={25} />}
                  onClick={() =>
                    subtitleNumber > 1
                      ? setSubtitleNumber(subtitleNumber - 1)
                      : null
                  }
                />
              </button>
              <button className="cursor-pointer hover:text-primary">
                <IconText
                  text={'Next'}
                  trailing={<BsArrowRightShort size={25} />}
                  onClick={() =>
                    subtitleNumber < course.subtitles.length
                      ? setSubtitleNumber(subtitleNumber + 1)
                      : null
                  }
                />
              </button>
            </div>
            {course?.subtitles.map((subtitle: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 my-1 border border-gray-300 rounded-md cursor-pointer  ${
                  subtitleNumber === index + 1
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setSubtitleNumber(index + 1)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-semibold">{subtitle.title}</p>
                    <p className="text-xs text-gray-500">{subtitle.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearningPage;
