import { UserModel } from '../models';

export const addUser = (data: typeof UserModel) => {
  const user = UserModel.create(data);
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
    throw new Error('User not found');
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
  if (!instructor) throw new Error('instructor not found');
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
  if (!instructor) throw new Error('instructor not found');
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
