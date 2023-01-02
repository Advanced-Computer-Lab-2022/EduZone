export declare type Question = {
  _id?: string;
  question: string;
  answers: {
    _id?: string;
    answer: string;
    isCorrect: boolean;
  }[];
};
