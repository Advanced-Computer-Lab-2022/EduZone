import React from 'react';
import ScaledCircularLoading from './ScaledCircularLoading';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-[60vh] ">
      <ScaledCircularLoading loading={true} />
    </div>
  );
};

export default LoadingComponent;
