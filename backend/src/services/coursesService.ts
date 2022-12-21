import axios, { AxiosResponse } from 'axios';
import { CourseModel, UserModel } from '../models';
import { ObjectId } from 'mongodb';
import durationConverter from '../utils/duration_converter';
import Stripe from 'stripe';
import fs from 'fs';
import pdf from 'pdf-creator-node';
import sendMail from '../utils/sendMail';
// const stripe = require('stripe')();

export const getAllCourses = async (
  filters: any,
  page?: string,
  limit?: string
) => {
  const { price, rating, maxPrice, minPrice, query, subject, instructor } =
    filters;
  console.log(filters);

  // const search_query = [
  //   ...(title && { title: { $regex: title, $options: 'i' } }),
  //   ...(subject && { subject: { $regex: subject, $options: 'i' } }),
  //   ...(instructor && { instructor: instructorId._id }),
  //   ...(price && { price: price }),
  //   ...(rating && { rating: { $gte: rating } }),
  //   ...(maxPrice && { price: { $lte: maxPrice } }),
  //   ...(minPrice && { price: { $gte: minPrice } }),
  // ];
  let search_query: any = query
    ? [
        { title: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
      ]
    : [];

  let instructorId: any = '';
  if (query) {
    //get instructor id by name
    instructorId = await UserModel.findOne({
      name: { $regex: query, $options: 'i' },
    }).select('_id');
    search_query = [...search_query, { instructor: instructorId?._id }];
  }

  const filter_query = {
    ...(price && { price: price }),
    ...(rating && { rating: { $gte: rating } }),
    ...(maxPrice && { price: { $lte: maxPrice } }),
    ...(minPrice && { price: { $gte: minPrice } }),
    ...(subject && { subject: { $regex: subject, $options: 'i' } }),
    ...(instructor && { instructor: instructor }),
  };

  const full_query = query
    ? { $or: search_query, ...filter_query }
    : filter_query;

  const courses = CourseModel.find(full_query)
    .populate('instructor', [
      'name',
      'username',
      '_id',
      'email',
      'img',
      'feedback',
    ])
    .sort({ enrolled: -1 });

  if (page && limit) {
    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (currentPage - 1) * pageSize;
    const total = await CourseModel.countDocuments(full_query);
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

const getVideoDuration = async (subtitles_ids: string[]) => {
  const durations: any[] = [];
  // fetch each 10 id at a time
  for (let i = 0; i < subtitles_ids.length; i += 10) {
    const ids = subtitles_ids.slice(i, i + 10);
    let url = 'https://www.googleapis.com/youtube/v3/videos?';
    for (let j = 0; j < 10; j++) {
      if (ids[j] == undefined) break;
      url += `id=${ids[j]}&`;
    }
    url += `&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`;

    const res = await fetch(url).then((data: any) => data.json());
    // { data: duration_fetch }
    console.log(res);
    res.items.map((item: any) => {
      console.log(item.contentDetails.duration);
      durations.push(
        Number(durationConverter(item.contentDetails.duration)).toFixed(2)
      );
    });
    // durations = [...durations, ...subtitles.map((s) => s.duration)];
  }
  return durations;
};

//Add a new Course

export const addCourse = async (data: typeof CourseModel & { token: any }) => {
  const { token, ...courseData } = data;
  console.log(
    'data',
    (courseData as any).subtitles.map((s: any) => s.youtube_url.split('v=')[1])
  );

  const durations = await getVideoDuration(
    (courseData as any).subtitles.map((s: any) => s.youtube_url.split('v=')[1])
  );
  console.log('Here');

  const modifiedCourseData = {
    ...courseData,
    instructor: token.id,
    subtitles: (courseData as any).subtitles.map(
      (subtitle: any, index: number) => ({
        ...subtitle,
        price: Number(subtitle.price),
        youtube_url: subtitle.youtube_url,
        duration: durations[index],
      })
    ),
  };
  console.log(modifiedCourseData);
  const course = CourseModel.create(modifiedCourseData);
  return course;
};
// Get Course By ID
export const getCourseById = async (id: string) => {
  const course = await CourseModel.findById(id).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  return course;
};

//Update Course By ID
export const updateCourseById = async (
  id: string,
  data: Partial<typeof CourseModel>
) => {
  return await CourseModel.findByIdAndUpdate(id, data).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
};

export const deleteCourseById = async (id: string) => {
  return await CourseModel.findByIdAndDelete(id);
};

/**
 * Course exercies
 */

// Create final exercise
export const createFinalExercise = async (courseId: string, finalExam: any) => {
  const course = await CourseModel.findByIdAndUpdate(
    courseId,
    { finalExam },
    {
      new: true,
    }
  );
  return course;
};

export const getSubtitleByCourseAndId = async (
  courseId: string,
  subtitleId: string
) => {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  const subtitle = course?.subtitles.find(
    (s) => s._id?.toString() === subtitleId
  );
  return subtitle;
};

export const updateSubtitleByCourseAndId = async (
  courseId: string,
  subtitleId: string,
  data: any
) => {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  let subtitle = {};
  let index = -1;
  course?.subtitles.map((s, i) => {
    if (s._id?.toString() === subtitleId) {
      subtitle = s;
      index = i;
    }
  });
  if (index === -1) throw new Error('Subtitle not found');
  course.subtitles[index] = {
    ...subtitle,
    ...data,
  };
  await course?.save();
  return course?.subtitles[index];
};

export const addSubtitleExercise = async (
  courseId: string,
  subtitleId: string,
  data: any
) => {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  const subtitle = course.subtitles.id(subtitleId);
  if (subtitle) {
    subtitle.exercise = data;
    await course.save();
    return subtitle;
  }
  throw new Error('Subtitle not found');
};

export const buyCourse = async (
  courseId: string,
  studentId: string,
  studentEmail: string,
  paymentId: string
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!course) throw new Error('Course not found');
  const isEnrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (isEnrolled) throw new Error('Already enrolled');

  const success = await payForCourse(
    course.title,
    studentId,
    studentEmail,
    course.price as number,
    paymentId
  );

  if (!success) throw new Error('Payment failed');
  course.enrolled.push({
    studentId,
    exercises: [],
    finalExam: {
      submitted: false,
      score: -1,
      answers: [],
    },
    payment: {
      id: paymentId,
      amount: course.price as number,
    },
  });
  await course.save();

  return course;
};

export const rateCourse = async (
  courseId: string,
  studentId: string,
  rating: number
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  enrolled.rating = rating;
  await course.save();
  return course;
};
export const reviewCourse = async (
  courseId: string,
  studentId: string,
  review: string
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  enrolled.review = review;
  console.log('Enrolled', enrolled);
  await course.save();
  return course;
};

export const publishCourse = async (courseId: string) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!course) throw new Error('Course not found');
  course.isPublished = true;
  await course.save();
  return course;
};

export const getTraineeCourses = async (studentId: string) => {
  const courses = await CourseModel.find({
    'enrolled.studentId': studentId,
  }).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  return courses;
};

export const traineeSubmitSubtitleExercise = async (
  courseId: string,
  subtitleId: string,
  studentId: string,
  exerciseId: string,
  answers: any
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);

  if (!course) throw new Error('Course not found');
  const subtitle = course.subtitles.id(subtitleId);
  if (!subtitle) throw new Error('Subtitle not found');
  if (!subtitle.exercise)
    throw new Error('Subtitle does not contain an exercise');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  const exercise = enrolled.exercises.find((e) => e?.exerciseId === exerciseId);
  if (exercise) throw new Error('Already submitted');
  if (subtitle.exercise === undefined)
    throw new Error('Subtitle contains no exercise');

  const questionsCount = subtitle.exercise?.questions.length;
  if (
    questionsCount > answers.filter((a: any) => a.answerId !== undefined).length
  )
    throw new Error('You need to answer all questions');

  // console.log('Answers', answers);
  // console.log('Questions', subtitle.exercise?.questions);
  let correctAnswers = 0;
  answers.map((submittedAnswer: any) => {
    const question = subtitle.exercise?.questions.find(
      (q: any) => q._id.toString() === submittedAnswer.questionId
    );
    if (!question) throw Error('Question error');
    if (
      question?.answers?.find(
        (a: any) => a?._id.toString() === submittedAnswer?.answerId
      )?.isCorrect
    )
      correctAnswers++;
  });

  const score = (100 * correctAnswers) / questionsCount;

  enrolled.exercises.push({
    exerciseId,
    score: (100 * correctAnswers) / questionsCount,
    answers: answers.map((a: any) => a.answerId),
    submittedAt: new Date(),
    viewedCorrectAnswers: false,
  });
  console.log('Here 1');
  if (!enrolled.completed)
    enrolled.completed = {
      finalExam: false,
      exercises: [],
      subtitles: [],
    };
  enrolled.completed.exercises = [...enrolled.completed.exercises, exerciseId];

  await course.save();

  return score;
};

export const traineeSubmitFinalExam = async (
  courseId: string,
  studentId: string,
  answers: any
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  if (enrolled.finalExam?.submitted)
    throw new Error('Final exam already submitted');
  const questionsCount = course.finalExam?.questions?.length ?? 0;

  console.log('Question Count', questionsCount);
  console.log('Answers', answers);

  // if (!enrolled.finalExam) {

  // }

  if (
    questionsCount > answers.filter((a: any) => a.answerId !== undefined).length
  )
    throw new Error('You need to answer all questions');

  let correctAnswers = 0;
  answers.map((submittedAnswer: any) => {
    const question = course.finalExam?.questions.find(
      (q: any) => q._id.toString() === submittedAnswer.questionId
    );
    if (!question) throw Error('Question error');
    if (
      question?.answers?.find(
        (a: any) => a?._id.toString() === submittedAnswer?.answerId
      )?.isCorrect
    )
      correctAnswers++;
  });

  const score = (100 * correctAnswers) / questionsCount;

  // if (!enrolled.finalExam) {
  const finalExam = {
    submitted: true,
    score,
    answers: answers.map((a: any) => a.answerId),
    submittedAt: new Date(),
  };
  enrolled.finalExam = finalExam;

  if (!enrolled.completed)
    enrolled.completed = {
      finalExam: false,
      exercises: [],
      subtitles: [],
    };
  enrolled.completed.finalExam = true;

  await course.save();
  return score;

  // }

  // enrolled!.finalExam.submitted = true;
  // enrolled.finalExam.score = score;
  // enrolled.finalExam.answers = answers.map((a: any) => a.answerId);
  // enrolled.finalExam.submittedAt = new Date();
  // await course.save();
  // return score;
};

export const payForCourse = async (
  courseTitle: string,
  studentId: string,
  email: string,
  amount: number,
  paymentId: string
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2022-11-15',
  });
  if (!courseTitle || !studentId || !email || !amount) {
    throw new Error('Invalid parameters');
  }

  const { id: customerId }: any = await stripe.customers
    .create({
      email: email,
      source: paymentId,
    })
    .catch((e: Error) => {
      console.log(e);
      return null;
    });

  if (!customerId) {
    return false;
  }

  const invoiceId = `${email}-${Math.random().toString()}-${Date.now().toString()}`;

  const charge = await stripe.charges
    .create(
      {
        amount: amount * 100,
        currency: 'USD',
        customer: customerId,
        receipt_email: email,
        description: `Course Payment: ${courseTitle}`,
      },
      { idempotencyKey: invoiceId }
    )
    .catch((e: Error) => {
      console.log(e);
      return null;
    });

  if (!charge) {
    return false;
  }

  return true;
};

export const getMostPopularCourses = async (limit?: number) => {
  // get top 5 courses with most enrolled students
  const courses = await CourseModel.find()
    .sort({ enrolled: -1 })
    .limit(limit ?? 5)
    .populate('instructor', ['name', 'img']);
  return courses;
};

export const completeCourseItem = async (
  courseId: string,
  studentId: string,
  item: 'finalExam' | 'exercise' | 'subtitle',
  itemId?: string
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'img',
    '_id',
  ]);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  if (!enrolled.completed)
    enrolled.completed = {
      finalExam: false,
      exercises: [],
      subtitles: [],
    };
  if (item === 'finalExam') {
    enrolled.completed.finalExam = true;
  } else {
    if (!itemId) throw Error('ItemId should be provided');
    if (item === 'exercise') {
      if (!enrolled.completed.exercises.includes(itemId))
        enrolled.completed.exercises = [
          ...enrolled.completed.exercises,
          itemId,
        ];
    } else {
      if (!enrolled.completed.subtitles.includes(itemId))
        enrolled.completed.subtitles = [
          ...enrolled.completed.subtitles,
          itemId,
        ];
    }
  }

  await course.save();
  return course;
};

const sendCertificate = (
  studentEmail: string,
  studentName: string,
  courseTitle: string,
  certificate: string
) => {
  // http://localhost:4000/media/certificates?url=${certificate}
  const message = `
  <div style='text-align:center; font-family:sans-serif;'>
    <h1>
      Congratulations, ${studentName}
    </h1>
    <h2 style="margin-bottom:50px;">
      You have successfully completed the course: ${courseTitle}
    </h2>
    <a clicktracking=off style='background-color:#5087cd; padding: 12px 18px; color:white; text-decoration: none;  border-radius:5px;' href='http://localhost:4000/media/certificates?url=${certificate}' download>
      Download your certificate
    </a>
    <p>If the above button is not working click this link: <a  href='http://localhost:4000/media/certificates?url=${certificate}'>
      http://localhost:4000/media/certificates?url=${certificate}
    </a> </p>
  </div>
  `;
  try {
    sendMail({
      email: studentEmail,
      subject: 'Congratulation! Course Completed',
      html: message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const finishCourse = async (
  courseId: string,
  studentId: string,
  studentName: string,
  studentEmail: string
) => {
  const course = await CourseModel.findById(courseId).populate('instructor', [
    'name',
    'img',
    '_id',
  ]);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  // if (!enrolled.finished) return;
  if (!enrolled.completed)
    throw new Error('You need to complete all course items');
  if (enrolled.completed.subtitles.length !== course.subtitles.length)
    throw new Error('You need to complete all subtitles');
  if (
    enrolled.completed.exercises.length !==
    course.subtitles.reduce((acc, s) => acc + (s.exercise ? 1 : 0), 0)
  )
    throw new Error('You need to complete all exercises');
  if (course?.finalExam) {
    if (!enrolled.completed.finalExam)
      throw new Error('You need to complete final exam');
    if (enrolled.finalExam?.score && enrolled.finalExam?.score < 50)
      throw new Error('You need to pass the final exam');
  }
  enrolled.finished = true;
  enrolled.finishedAt = new Date();
  await course.save();
  const certificate = await getCourseCertificate(courseId, studentId);
  sendCertificate(studentEmail, studentName, course?.title, certificate);
  return course;
};

export const getCourseCertificate = async (
  courseId: string,
  studentId: string
) => {
  const user = await UserModel.findById(studentId);
  if (!user) throw new Error('User not found');
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  const enrolled = course.enrolled.find((s) => s.studentId === studentId);
  if (!enrolled) throw new Error('Not enrolled');
  if (enrolled.certificate) return enrolled.certificate;
  if (!enrolled.finished) throw new Error('You need to finish the course');
  console.log(process.cwd());
  const template = fs.readFileSync(
    `${process.cwd()}/templates/certificate.html`,
    'utf8'
  );

  const options = {
    format: 'A4',
    orientation: 'landscape',
    border: '0mm',
    header: {
      height: '0mm',
      contents: '',
    },
    footer: {
      height: '0mm',
      contents: '',
    },
  };

  const filename = `certificates/${courseId}-${studentId}.pdf`;
  const path = `${process.cwd()}/${filename}`;
  const bitmap = fs.readFileSync(process.cwd() + '/templates/EduZone.png');
  const logo = bitmap.toString('base64');
  const backbmp = fs.readFileSync(
    process.cwd() + '/templates/certificate_base.png'
  );
  const background = backbmp.toString('base64');
  const document = {
    html: template,
    data: {
      name: user.name,
      course: course.title,
      date: new Date(enrolled.finishedAt ?? Date.now()).toLocaleDateString(),
      logo: logo,
      background,
    },
    path,
    type: '',
  };

  pdf
    .create(document, options)
    .then(async (res) => {
      // console.log(res);
      enrolled.certificate = filename;
      await course.save();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return filename;
};
