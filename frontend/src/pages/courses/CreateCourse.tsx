import React, { FormEventHandler, useRef, useState } from 'react';
import InputFieldCourse from '../../components/common/InputField';
import { MdEmail } from 'react-icons/md';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { axios } from '../../utils';
import { Subtitle } from '../../types/entities/Subtitle';

//import axios from '../utils';

const AdminCreateUser = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const instructorId = searchParams.get('instructorId');
  const navigate = useNavigate();
  const [subtitlesCount, setSubtitlesCount] = useState(1);
  const [subtitles, setSubtitles] = useState([
    {
      title: '',
      duration: 0,
      youtube_url: '',
      order: 1,
    },
  ] as Subtitle[]);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const selectSubtitle = (value: string) => {
    const index = value.split('-')[2];
    setCurrentSubtitle(parseInt(index) - 1);
  };
  const subtitlesContainer = useRef<HTMLDivElement>(null);
  const onChangeInput = (name: string, value: string) => {
    // const input = e.target as HTMLInputElement;
    alert(name + ' ' + value);
    const index = name.split('-')[2];
    const newSubtitles = [...subtitles];
    newSubtitles[parseInt(index) - 1].title = value;
    setSubtitles(newSubtitles);
  };

  const addSubtitle = () => {
    setSubtitles([
      ...subtitles,
      {
        title: '',
        duration: 0,
        youtube_url: '',
        order: subtitlesCount + 1,
      },
    ]);
    setSubtitlesCount(subtitlesCount + 1);
  };

  const removeSubtitle = () => {
    if (subtitlesCount > 1) {
      setSubtitlesCount(subtitlesCount - 1);
    }
    setSubtitles(subtitles.slice(0, -1));
  };
  const onSubmit: FormEventHandler = async (e) => {
    console.log('Here');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = { ...Object.fromEntries(formData), instructor: instructorId };
    console.log(
      Object.entries(Object.fromEntries(formData)).map(([key, value]) => {
        if (key.startsWith('subtitle')) {
          return { subtitle: value };
        }
        return value;
      })
    );

    console.log(subtitles);
    // try {
    //   const res = await axios({
    //     url: `/courses`,
    //     method: 'POST',
    //     data,
    //   });
    //   if (res.status === 201) {
    //     navigate(`/instructors/${instructorId}/courses`);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <AdminLayout>
      <div className="ml-2 mr-2gap-4" ref={mainRef}>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={onSubmit}
          method="POST"
        >
          <div className="col-span-2 flex justify-between">
            <p className="text-3xl font-medium text-center mb-3 ">
              Add New Course
            </p>
            <div>
              <input
                type="submit"
                value="Save Course"
                className="p-2 px-4 bg-primary text-white cursor-pointer rounded-md"
              />
            </div>
          </div>
          <div>
            <div className="">
              <div className="">
                <p>Course title</p>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="Course Title Goes Here"
                  name="title"
                />
              </div>
              <div className=" flex flex-col justify-between">
                <div>
                  <p>Subject</p>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    placeholder="Enter Subject"
                    name="subject"
                  />
                </div>
                <div>
                  <p>Price</p>
                  <input
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    placeholder="Course Price"
                    name="price"
                  />
                </div>
              </div>
              <div>
                <p>Description </p>
                <textarea
                  rows={10}
                  className="w-full p-4 rounded-md"
                  placeholder="Please Enter the Course Description"
                  name="summary"
                />
              </div>
            </div>
          </div>
          <div>
            <div ref={subtitlesContainer} className="children:">
              {subtitles.map((subtitle, index) => (
                <div key={index}>
                  <p>Subtitle {index + 1}</p>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-2"
                    placeholder="Title"
                    name={`subtitle-title-${index + 1}`}
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const newSubtitles = [...subtitles];
                      newSubtitles[index].title = input.value;
                      setSubtitles(newSubtitles);
                    }}
                    value={subtitle.title}
                  />
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    placeholder="Youtube Link"
                    name={`subtitle-link-${subtitlesCount}`}
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const newSubtitles = [...subtitles];
                      newSubtitles[index].youtube_url = input.value;
                      setSubtitles(newSubtitles);
                    }}
                    value={subtitle.youtube_url}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <div
                className="bg-gray-400  text-white text-lg py-2 text-center rounded-md my-2 cursor-pointer w-14"
                onClick={() => removeSubtitle()}
              >
                -
              </div>
              <div
                className="w-14 bg-green-600  text-white text-lg py-2 text-center rounded-md my-2 cursor-pointer"
                onClick={() => addSubtitle()}
              >
                +
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

const SubtitleList: React.FC<{ count: number }> = ({ count }) => {
  for (let i = 0; i < count; i++) {
    return (
      <div>
        <p>Subtitle {i + 1}</p>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          placeholder="Subtitle"
          name={`subtitle-${i + 1}`}
        />
      </div>
    );
  }
  return <></>;
};

export default AdminCreateUser;
