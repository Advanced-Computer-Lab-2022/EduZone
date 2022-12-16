import React from 'react';
import { AvatarProps } from '../../../../../types';

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ img, name, onClick }, ref) => {
    return (
      <div
        className="w-10 h-10 rounded-full overflow-clip cursor-pointer border-gray-300 border-2"
        onClick={onClick}
        ref={ref}
      >
        {img ? (
          <div className="w-full h-full flex items-center justify-center relative ">
            <img src={img} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-full text-lg bg-primary  flex items-center justify-center text-white font-semibold">
            {name.toUpperCase()[0]}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
