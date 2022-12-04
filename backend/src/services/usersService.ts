import { UserModel } from '../models';

export const addUser = (data: typeof UserModel) => {
  const user = UserModel.create(data);
  return user;
};

export const getUserById = (id: string) => {
  const user = UserModel.findById(id);
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
