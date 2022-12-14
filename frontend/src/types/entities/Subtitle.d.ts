export declare type Subtitle = {
  _id?: string;
  title: string;
  duration: number;
  youtube_url: string;
  order: number;
  description: string;
  exercise?: {
    _id: string;
    questions: Question[];
  };
};
