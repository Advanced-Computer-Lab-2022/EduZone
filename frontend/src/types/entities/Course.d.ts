import { Subtitle } from './Subtitle';

export declare type Course = {
  _id: string;
  title: string;
  price: number;
  thumbnail?: string;
  //TODO change to refrence a user with role instructor
  instructor: string | Partial<User>;
  rating: number;
  subject: string;
  subtitles?: Subtitle[];
  summary: string;
  preview_video?: string;
  discount?: {
    amount: number;
    validUntil: Date;
  };
  createdAt: Date;
  finalExam?: {
    questions: Question[];
  };
};
