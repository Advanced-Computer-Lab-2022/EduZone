import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Layout from '../layout/Trainee/Layout';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getCookie } from 'cookies-next';
import { axios } from '../../utils';
import { useParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { FaDownload } from 'react-icons/fa';

const CourseCertificate = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const getFilePluginInstance = getFilePlugin();

  const { id: courseId } = useParams();
  const [certificate, setCertificate] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const getCertificate = async () => {
    const res = await axios({
      url: '/courses/' + courseId + '/certificate',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + getCookie('access-token'),
      },
    });
    console.log(res);
    setCertificate(res.data.certificate);
    setLoading(false);
  };
  const { name } = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    getCertificate();
  }, []);
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-2/3 mx-auto">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-medium text-gray-700">
            Congratulations, {name}
          </h1>
          <a
            href={`http://localhost:4000/media/certificates?url=${certificate}`}
            download
            className="text-primary border border-primary px-4 py-2 rounded-lg my-3  flex items-center gap-3 hover:text-white hover:bg-primary"
          >
            <FaDownload />
            Download Certificate
          </a>
        </div>

        {loading ? (
          <div className="w-full text-center bg-gray-300 animate-pulse rounded-lg h-[30rem] flex items-center justify-center text-gray-600">
            Loading Certificate...
          </div>
        ) : (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js">
            <div className="w-full bg-white py-8 rounded-lg ">
              <Viewer
                defaultScale={1}
                fileUrl={`http://localhost:4000/media/certificates?url=${certificate}`}
                plugins={[]}
              />
            </div>
          </Worker>
        )}
      </div>
    </Layout>
  );
};

export default CourseCertificate;
