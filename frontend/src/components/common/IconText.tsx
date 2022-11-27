import { Link } from 'react-router-dom';
import React from 'react';
import { IconTextProps as Props } from '../../types/components/common/IconText';

const IconText: React.FC<Props> = ({
  leading,
  trailing,
  link,
  text,
  url,
  onClick,
}) => {
  const skeletonProps = { text, leading, trailing };
  if (link && url) {
    if (link === 'internal') {
      return (
        <Link to={url}>
          <Skeleton {...skeletonProps} />
        </Link>
      );
    } else {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <Skeleton {...skeletonProps} />
        </a>
      );
    }
  }
  return <Skeleton {...skeletonProps} onClick={onClick} />;
};

const Skeleton: React.FC<Partial<Props>> = ({
  leading,
  text,
  trailing,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 " onClick={onClick}>
      {leading} {text} {trailing}
    </div>
  );
};

export default IconText;
