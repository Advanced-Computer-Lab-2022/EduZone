import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center h-screen p-16 ">
      <button className="absolute top-10 left-10" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <img
        className="absolute top-10 right-10 w-32"
        src="/EduZone.png"
        alt="404"
      />

      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-primary">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl text-gray-600">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8 text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link
            rel="noopener noreferrer"
            to="/"
            className="px-8 py-3 font-semibold rounded bg-primary text-white "
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
