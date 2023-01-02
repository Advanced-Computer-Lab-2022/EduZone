// export declare type SidebarProps = {
//   primaryOpen: boolean;
//   secondaryOpen: boolean;
//   openPrimary: () => void;
//   openSecondary: () => void;
//   closePrimary: () => void;
//   closeSecondary: () => void;
//   setWidth: (number) => void;

import { SidebarHeaderProps } from './SidebarHeader';

// };
export declare type SidebarProps = SidebarHeaderProps & {
  setWidth: (number) => void;
  items?: Array<{
    name: string;
    icon: JSX.Element;
    link: string;
  }>;
};
