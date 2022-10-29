import { CourseModel, UserModel } from '../models';

export const getAllCourses = async (
  filters: any,
  page?: string,
  limit?: string
) => {
  const { title, subject, instructor, price, rating, maxPrice, minPrice } =
    filters;
  let instructorId: any = '';
  if (instructor) {
    //get instructor id by name
    instructorId = await UserModel.findOne({
      name: { $regex: instructor, $options: 'i' },
    }).select('_id');
  }

  const query = {
    ...(title && { title: { $regex: title, $options: 'i' } }),
    ...(subject && { subject: { $regex: subject, $options: 'i' } }),
    ...(instructor && { instructor: instructorId._id }),
    ...(price && { price: price }),
    ...(rating && { rating: { $gte: rating } }),
    ...(maxPrice && { price: { $lte: maxPrice } }),
    ...(minPrice && { price: { $gte: minPrice } }),
  };
  const courses = CourseModel.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor',
      },
    },
    {
      $unwind: {
        path: '$instructor',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        subject: 1,
        instructor: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
        price: 1,
        rating: 1,
        createdAt: 1,
      },
    },
  ]);

  if (page && limit) {
    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (currentPage - 1) * pageSize;
    const total = await CourseModel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const results = await courses.skip(skip).limit(pageSize).exec();
    return {
      courses: results,
      pagination: {
        currentPage,
        totalPages,
        pageSize,
        total,
      },
    };
  }

  return { courses: await courses.skip(0).exec() };
};

const getPriceQuery = (price: string) => {
  if (price.includes('-')) {
    const [min, max] = price.split('-');
    return { $gte: min, $lte: max };
  } else if (price.includes('>')) {
    const min = price.split('>')[1];
    console.log(
      '🚀 ~ file: coursesController.ts ~ line 94 ~ getPriceQuery ~ min',
      min
    );
    return { $gte: min };
  } else if (price.includes('<')) {
    const max = price.split('<')[1];
    return { $lte: max };
  } else {
    return price;
  }
};

// const courses = CourseModel.find(filters).populate('instructor', [
//   'name',
//   'username',
//   '_id',
//   'email',
// ]);

// if (title) {
//   courses.find({ title: { $regex: title, $options: 'i' } });
// }

// if (subject) {
//   courses.find({ subject: { $regex: subject, $options: 'i' } });
// }

// if (instructor) {
//   //get instructor id by name
//   const instructorId = await UserModel.findOne({
//     name: { $regex: instructor, $options: 'i' },
//   }).select('_id');

//   courses.find({ instructor: instructorId });
// }
// if (price) {
//   if (price.includes('-')) {
//     const [min, max] = price.split('-');
//     courses.find({ price: { $gte: min, $lte: max } });
//   } else if (price.includes('>')) {
//     const min = price.split('>')[1];
//     courses.find({ price: { $gte: min } });
//   } else if (price.includes('<')) {
//     const max = price.split('<')[1];
//     courses.find({ price: { $lte: max } });
//   } else {
//     courses.find({ price: price });
//   }
// }

// if (rating) {
//   if (rating.includes('>')) {
//     const min = rating.split('>')[1];
//     courses.find({ rating: { $gte: min } });
//   } else if (rating.includes('<')) {
//     const max = rating.split('<')[1];
//     courses.find({ rating: { $lte: max } });
//   } else {
//     courses.find({ rating: rating });
//   }
// }

// if (limit && page) {
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   courses.skip(skip).limit(parseInt(limit));
// }

// get courses count
// const count = await (await courses).length;
// return { data: courses, count };
// return courses;
// };

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
