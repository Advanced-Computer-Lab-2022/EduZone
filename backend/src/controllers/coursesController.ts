//import from the Courses Model

//Add a new Course
export const addCourse = (instructor: string, title: string) => {
  return { Instructor: instructor, Title: title };
  // const course = new Courses({   TODO: Waiting Schema
  //    instructor: instructor,
  //    title: title
  // });
  //return await course.save();
};
// Get Course By ID
export const getCourseById = (id: string) => {
  //return Courses.findById(id);  TODO: Waiting Schema
  return {
    id: id,
  };
};

//Update Course By ID
export const updateCourseById = (
  id: string,
  instructor: string,
  title: string
) => {
  //return Courses.findByIdAndUpdate(id, { instructor: instructor, title: title });  TODO: Waiting Schema
  return (
    'id ' +
    id +
    '\n' +
    'instructor ' +
    instructor +
    '\n' +
    'title ' +
    title +
    '\n' +
    'updated successfully'
  );
};
