import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
const InstructorPolicy = () => {
  const { id } = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex flex-col w-1/2 mx-auto items-center justify-center text-justify h-screen space-y-5">
      <p>
        <b>MIT License Copyright (c) [year] [fullname]</b>
      </p>{' '}
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the
        "Software"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions: The above copyright notice and this permission
        notice shall be included in all copies or substantial portions of the
        Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
      <Link
        to={`/instructor/${id}`}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        AGREE AND CONTINUE
      </Link>
    </div>
  );
};

export default InstructorPolicy;
