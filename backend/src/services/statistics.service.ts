import mongoose from 'mongoose';
import { CourseModel, UserModel } from '../models';
import AccessRequestModel from '../models/accessRequest.model';
import RefundRequestModel from '../models/refundRequests.model';

export const getAdminStatistics = async () => {
  const trainees_count = await UserModel.countDocuments({ role: 'trainee' });
  const corp_trainees_count = await UserModel.countDocuments({
    role: 'corp_trainee',
  });
  const instructors_count = await UserModel.countDocuments({
    role: 'instructor',
  });
  const courses_count = await CourseModel.countDocuments({});
  //get income from courses using the payment.amount in enrolled object for each student in enrolled array in course model
  const users_count = await UserModel.countDocuments({});
  const income = await CourseModel.aggregate([
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$enrolled.payment.amount',
        },
      },
    },
  ]);

  const reported_problems = await CourseModel.aggregate([
    {
      $unwind: '$reportedProblems',
    },
    {
      $group: {
        _id: '$reportedProblems.status',
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const enrolled_students = await CourseModel.aggregate([
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: '$title',
        total: {
          $sum: 1,
        },
      },
    },
  ]);
  const monthly_income = await CourseModel.aggregate([
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: {
          month: { $month: '$enrolled.payment.date' },
          year: { $year: '$enrolled.payment.date' },
        },
        total: {
          $sum: '$enrolled.payment.amount',
        },
      },
    },
  ]);

  const access_requests = await AccessRequestModel.aggregate([
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'user',
    //     foreignField: '_id',
    //     as: 'user',
    //   },
    // },
    // {
    //   $lookup: {
    //     from: 'courses',
    //     localField: 'course',
    //     foreignField: '_id',
    //     as: 'course',
    //   },
    // },
    {
      $group: {
        _id: '$status',
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const refund_requests = await RefundRequestModel.aggregate([
    {
      $group: {
        _id: '$status',
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  return {
    users: {
      trainees: trainees_count,
      corp_trainees: corp_trainees_count,
      instructors: instructors_count,
      total: users_count,
    },
    enrolled_students: {
      data: enrolled_students,
      total: enrolled_students.reduce((acc, curr) => acc + curr.total, 0),
    },
    courses_count,
    income: {
      monthly: monthly_income,
      total: income[0].total,
    },
    reported_problems: {
      data: reported_problems,
      total: reported_problems.reduce((acc, curr) => acc + curr.total, 0),
    },
    access_requests: {
      data: access_requests,
      total: access_requests.reduce((acc, curr) => acc + curr.total, 0),
    },
    refund_requests: {
      data: refund_requests,
      total: refund_requests.reduce((acc, curr) => acc + curr.total, 0),
    },
  };
};

export const getInstructorStatistics = async (
  instructorId: mongoose.Types.ObjectId
) => {
  console.log(instructorId);
  //get total enrolled students in courses by instructor using the number of students in enrolled array in course model
  const enrolled_students = await CourseModel.aggregate([
    {
      $match: {
        instructor: instructorId,
      },
    },
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: '$title',
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const total_enrolled_students: number = enrolled_students.reduce(
    (acc, curr) => acc + curr.total,
    0
  );
  //get total income from courses using the payment.amount in enrolled object for each student in enrolled array in course model (filter by instructor) and deduct 60% from the total which is the company's share

  //group the income for instructor and return the total income for the instructor grouped by month and year

  const monthly_income = await CourseModel.aggregate([
    {
      $unwind: '$enrolled',
    },
    {
      $match: {
        instructor: instructorId,
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$enrolled.payment.date' },
          year: { $year: '$enrolled.payment.date' },
        },
        total: {
          $sum: '$enrolled.payment.amount',
        },
      },
    },
    {
      $project: {
        total: { $multiply: ['$total', 0.4] },
      },
    },
  ]);

  const total_income = await CourseModel.aggregate([
    {
      $match: {
        instructor: instructorId,
      },
    },
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: null,

        total: {
          $sum: '$enrolled.payment.amount',
        },
      },
    },
    {
      $project: {
        total: { $multiply: ['$total', 0.4] },
      },
    },
  ]);

  const courses_income = await CourseModel.aggregate([
    {
      $match: {
        instructor: instructorId,
      },
    },
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: '$title',

        total: {
          $sum: '$enrolled.payment.amount',
        },
      },
    },
  ]);
  // const net_income = total_income[0].total * 40;
  const total_courses = await CourseModel.countDocuments({
    instructor: instructorId,
  });

  const average_final_grades = await CourseModel.aggregate([
    {
      $match: {
        instructor: instructorId,
      },
    },
    {
      $unwind: '$enrolled',
    },
    {
      $group: {
        _id: '$title',
        average: {
          $avg: '$enrolled.finalExam.score',
        },
      },
    },
  ]);
  return {
    enrolled_students: {
      data: enrolled_students,
      total: total_enrolled_students,
    },
    income: {
      data: {
        courses: courses_income,
        monthly: monthly_income,
      },
      total: total_income[0]?.total || 0,
    },
    total_courses,
    average_final_grades,
  };
};
