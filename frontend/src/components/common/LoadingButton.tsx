import React from 'react';
import CircularLoadingIndicator from './CircularLoadingIndicator';

const LoadingButton: React.FC<{
  children: string | JSX.Element;
  loading: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, loading, className, onClick }) => {
  return (
    <button
      className={`bg-primary text-white rounded-sm flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <CircularLoadingIndicator loading={loading} />
      {children}
    </button>
  );
};

export default LoadingButton;
