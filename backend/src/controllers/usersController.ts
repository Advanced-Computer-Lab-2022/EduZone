import { UserModel } from '../models';

export const addUser = (data: typeof UserModel) => {
  const user = UserModel.create(data);
  return user;
};
