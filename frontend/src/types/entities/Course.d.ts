import { Section } from './Section';

export declare type Course = {
  _id: string;
  title: string;
  price: number;
  thumbnail?: string;
  //TODO change to refrence a user with role instructor
  instructor: string | Partial<User>;
  rating: number;
  subject: string;
  subtitles?: Section[];
  summary: string;
  preview_video?: string;
  discount?: number;
};
