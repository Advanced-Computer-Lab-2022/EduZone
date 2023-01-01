import NotFoundException from '../Exceptions/NotFoundException';
import { UserModel } from '../models';

export const addUser = (data: typeof UserModel) => {
  const user = UserModel.create({
    ...data,
    wallet: { balance: 0, transactions: [] },
  });
  return user;
};

export const getUserById = (id: string) => {
  const user = UserModel.findById(id)
    .lean()
    .populate({
      path: 'feedback',
      populate: {
        path: 'student',
        model: 'User',
        select: 'name username _id img',
      },
    });

  return user;
};

export const getUserByName = (name: string) => {
  const user = UserModel.findOne({ name });
  return user;
};
export const getAllUsers = () => {
  const users = UserModel.find();
  return users;
};

export const updateUser = (id: string, data: Partial<typeof UserModel>) => {
  const user = UserModel.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
};

export const reviewInstructor = async (
  instructorId: string,
  studentId: string,
  review: string
) => {
  const instructor = await UserModel.findById(instructorId).populate([
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!instructor) throw new NotFoundException('instructor not found');
  const oldFeedback = instructor.feedback.find((s) => s.student === studentId);
  if (oldFeedback) {
    oldFeedback.review = review;
    await instructor.save();
    return instructor;
  }
  instructor.feedback.push({ student: studentId, review });
  await instructor.save();
  return instructor;
};

export const rateInstructor = async (
  instructorId: string,
  studentId: string,
  rating: number
) => {
  const instructor = await UserModel.findById(instructorId).populate([
    'name',
    'username',
    '_id',
    'email',
    'img',
    'feedback',
  ]);
  if (!instructor) throw new NotFoundException('instructor not found');
  const oldFeedback = instructor.feedback.find((s) => s.student === studentId);
  if (oldFeedback) {
    oldFeedback.rating = rating;
    await instructor.save();
    return instructor;
  }
  instructor.feedback.push({ student: studentId, rating });
  await instructor.save();
  return instructor;
};

export const getUserReportedProblems = async (id: string) => {
  const user = await UserModel.findById(id).populate({
    path: 'reportedProblems.course',
    model: 'Course',
    select: 'title _id',
  });
  // console.log(user);
  if (!user) throw new NotFoundException('user not found');
  return user.reportedProblems;
};

const addNotification = async (
  userId: string,
  notification: {
    title: string;
    body: string;
    date: Date;
  }
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException('user not found');
  user.notifications.push(notification);
  await user.save();
  return user;
};

export const getNotifications = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException('user not found');
  if (!user.notifications)
    throw new NotFoundException('notification not found');
  return user.notifications;
};
