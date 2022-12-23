import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models';
import { getUserById } from './usersService';
import { userInfo } from 'os';
import crypto from 'crypto';
import sendMail from '../utils/sendMail';
import NotFoundException from '../Exceptions/NotFoundException';
import NotAuthenticated from '../Exceptions/NotAuthenticated';
import DuplicateException from '../Exceptions/DuplicateException';
import ForbiddenException from '../Exceptions/ForbiddenException';

export const login = async (username: string, password: string) => {
  // check if user exists
  const user = await UserModel.findOne({ username: username });
  if (!user) {
    throw new NotFoundException('User does not exist'); //TODO: change to custom error
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new NotAuthenticated('Incorrect password'); //TODO: change to custom error
  }

  const { accessToken, refreshToken } = getTokens(user);

  const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const prevLastLogin = user.lastLogin;
  // save refresh token to db
  user.refreshToken = encryptedRefreshToken;
  user.lastLogin = new Date();
  await user.save();

  return { accessToken, refreshToken, lastLogin: prevLastLogin };
};

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string,
  gender: 'male' | 'female'
) => {
  // check if email already exists
  const user = await UserModel.findOne({ $or: [{ username }, { email }] });
  if (user) {
    throw new DuplicateException('User already exists'); //TODO: change to custom error
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await UserModel.create({
    name: name,
    username: username,
    email: email.toLowerCase(),
    password: hashedPassword,
    gender: gender,
  });

  //generate access and refresh tokens

  const { accessToken, refreshToken } = getTokens(newUser);

  // encrypt refresh token
  const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);
  // store refresh token in db
  newUser.refreshToken = encryptedRefreshToken;

  // const prevLastLogin = newUser.lastLogin;
  newUser.lastLogin = new Date();
  await newUser.save();

  return { accessToken, refreshToken };
};

export const logout = async (id: string) => {
  // remove refresh token from db  (to be done)
  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundException('User does not exist'); //TODO: change to custom error
  }
  user.refreshToken = '';
  await user.save();

  return true;
};
export const resetPassword = async (
  resetPasswordToken: string,
  password: string
) => {
  const user = await UserModel.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new ForbiddenException('Invalid token');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

export const forgetPassword = async (email: string) => {
  const user = await UserModel.findOne({
    email: email,
  });
  if (!user) {
    throw new NotFoundException('User does not exist'); //TODO: change to custom error
  }
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const url = `http://localhost:3000/reset-password/${user.resetPasswordToken}`;
  const message = `
  <h1>You have requested a password reset</h1>
  <p>Please go to this link to reset your password</p>
  <a href=${url} clicktracking=off style='background-color:#007ea7 ; padding: 8px 16px; color:white; text-decoration: none; border-radius:5px'>
    Reset Password
  </a>
  `;
  try {
    sendMail({
      email: user.email,
      subject: 'Password reset request',
      html: message,
    });
    console.log(user.resetPasswordToken);
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return false;
  }
  return true;
};

export const changePassword = async (id: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    throw new NotFoundException('User does not exist');
  }

  return true;
};

export const refreshTokens = async (userId: string, refreshToken: string) => {
  const user = await getUserById(userId);
  if (!user || !user.refreshToken)
    throw new NotAuthenticated('Access Denied, Please login again');
  const refreshTokenMatches = await bcrypt.compare(
    refreshToken,
    user.refreshToken
  );
  if (!refreshTokenMatches) throw new NotAuthenticated('Access Denied');
  const tokens = await getTokens(user);
  await updateRefreshToken(userId, tokens.refreshToken);
  return tokens;
};

const updateRefreshToken = async (userId: string, refreshToken: string) => {
  const hashedRefreshToken = await hashData(refreshToken);
  const user = await UserModel.findById(userId);
  if (user) {
    user.refreshToken = hashedRefreshToken;
    await user.save();
  } else throw new NotFoundException('User not found');
  // delete user.password;
  // return user;
};

const updateLastLoginAndRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  const hashedRefreshToken = await hashData(refreshToken);
  const user = await UserModel.findById(userId);
  if (user) {
    user.refreshToken = hashedRefreshToken;
    user.lastLogin = new Date();
    await user.save();
  } else throw new NotFoundException('User not found');
};

const hashData = async (data: string) => {
  return await bcrypt.hash(data, 10);
};

const getTokens = (user: any) => {
  console.log(user);
  //generate Access token
  const accessPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
    id: user._id,
    gender: user.gender,
    name: user.name,
    img: user.img ?? null,
    bio: user.bio ?? null,
  };

  const accessToken = jwt.sign(
    accessPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {}
  );

  //generate Refresh token
  const refreshPayload = { username: user.username, id: user._id };
  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: '7d',
    }
  );

  return { accessToken, refreshToken };
};
