//import from the Courses Model

//Add a new Course
const addCourse = (instructor: string, title: string) => {
  return (
    'Instructor: ' +
    instructor +
    '\n' +
    ' title : ' +
    title +
    '\n' +
    ' added successfully'
  );
  // const course = new Courses({   TODO: Waiting Schema
  //    instructor: instructor,
  //    title: title
  // });
  //return await course.save();
};
// Get Course By ID
const getCourseById = (id: string) => {
  //return Courses.findById(id);  TODO: Waiting Schema
  return 'Maths';
};

//Update Course By ID
const updateCourseById = (id: string, instructor: string, title: string) => {
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
export default { addCourse, getCourseById, updateCourseById };
