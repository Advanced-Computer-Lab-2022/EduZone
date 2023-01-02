import React from 'react';

const Modal: React.FC<{
  children: JSX.Element[] | JSX.Element;
  title?: string;
  open: boolean;
  close: () => void;
}> = ({ children, title = 'Modal Title', open, close }) => {
  if (!open) return null;
  return (
    <div
      className="absolute w-full h-screen bg-black/40 left-0 top-0 z-40 flex items-center justify-center  "
      // onClick={() => close()}
    >
      <div
        className="bg-white rounded-lg flex flex-col  p-5 w-1/3"
        onClick={() => ''}
      >
        <button
          className="self-end"
          onClick={() => {
            close();
          }}
        >
          Close
        </button>
        <h1 className="text-2xl font-medium text-center mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Modal;
