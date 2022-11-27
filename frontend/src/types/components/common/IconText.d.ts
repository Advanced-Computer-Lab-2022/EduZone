export declare type IconTextProps = {
  text: string;
  leading: string | JSX.Element;
  trailing?: string | JSX.Element;
  link?: 'internal' | 'external';
  url?: string;
  onClick?: () => void;
};
