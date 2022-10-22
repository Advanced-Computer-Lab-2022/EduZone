import { CourseModel } from '../models';

//Add a new Course
export const addCourse = (data: typeof CourseModel) => {
  const course = CourseModel.create(data);

  return course;
};
// Get Course By ID
export const getCourseById = async (id: string) => {
  const course = await CourseModel.findById(id);
  return course;
};

//Update Course By ID
export const updateCourseById = async (
  id: string,
  data: Partial<typeof CourseModel>
) => {
  return await CourseModel.findByIdAndUpdate(id, data);
};

export const deleteCourseById = async (id: string) => {
  return await CourseModel.findByIdAndDelete(id);
};
