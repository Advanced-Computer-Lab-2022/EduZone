import React, { useEffect, useState } from 'react';
import { TruncateProps } from '../../types';

const Truncate: React.FC<TruncateProps> = ({
  text,
  length,
  more,
  onClickMore,
}) => {
  const [truncatedText, setTruncatedText] = useState('' as string);
  useEffect(() => {
    if (text) {
      const array = text.split(' ').slice(0, length);
      setTruncatedText(array.join(' ') + '... ');
    }
  }, [text]);

  return (
    <div>
      {text.length > length ? truncatedText : text}
      {text && more && (
        <span className="underline cursor-pointer">Read More</span>
      )}
    </div>
  );
};

export default Truncate;
