import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from '../../redux/features/ui.reducer';
import { RootState } from '../../redux/store';

const Alert = () => {
  const { message } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  useEffect(() => {
    if (message)
      setTimeout(() => {
        dispatch(hideMessage());
      }, 5000);
  });
  if (!message) return null;
  return (
    <div className="absolute w-[25rem] min-h-[7rem] rounded-md bg-white z-40 right-8 top-16  border overflow-hidden">
      <div
        className={` w-full min-h-[7rem] py-6 px-5  relative border rounded-md
      ${
        message?.type === 'success'
          ? 'border-green-600 bg-green-600/40 text-green-800'
          : message?.type === 'error'
          ? 'border-red-600 bg-red-600/40 text-red-800'
          : 'border-blue-600 bg-blue-300/40 text-blue-800'
      }`}
      >
        <span
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => dispatch(hideMessage())}
        >
          <IoMdClose size={20} />
        </span>
        {message?.text}
        <div
          className={` animate-progress h-1.5 ${
            message?.type === 'success'
              ? ' bg-green-800'
              : message?.type === 'error'
              ? 'bg-red-800'
              : 'bg-blue-800'
          } absolute bottom-0 left-0`}
        ></div>
      </div>
    </div>
  );
};

export default Alert;
