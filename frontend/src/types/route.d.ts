export declare type RouteType = {
  path: string;
  parent?: boolean;
  element: ReactElement<any, any>;
  children?: Partial<RouteType>[];
};
