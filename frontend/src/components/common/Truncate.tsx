import React, { useEffect, useState } from 'react';
import { TruncateProps } from '../../types';

const Truncate: React.FC<TruncateProps> = ({
  text,
  length,
  more,
  onClickMore,
}) => {
  const [truncatedText, setTruncatedText] = useState('' as string);
  const [isTruncated, setIsTruncated] = useState(true);
  useEffect(() => {
    if (length > text.split(' ').length) setIsTruncated(false);
    if (text) {
      const array = text.split(' ').slice(0, length);
      // console.log(array);
      setTruncatedText(array.join(' ') + '... ');
    }
  }, [text]);

  return (
    <div>
      {isTruncated ? truncatedText : text}
      {text && text.split(' ').length > length && more && (
        <span
          className="underline cursor-pointer ml-1   text-primary text-sm"
          onClick={() => {
            setIsTruncated(!isTruncated);
          }}
        >
          {isTruncated ? 'Read More' : 'Show less'}
        </span>
      )}
    </div>
  );
};

export default Truncate;
