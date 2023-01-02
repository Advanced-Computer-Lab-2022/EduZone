import { Course } from '../types/entities/Course';

export default function calculateCourseRating(course: Course) {
  let total = 0;
  let sum = 0;
  course?.enrolled?.map((s: any) => {
    if (s.rating) {
      sum += s.rating;
      total++;
    }
  });

  return {
    total,
    rating: total ? sum / total : 0,
  };
}
