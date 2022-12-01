import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['trainee', 'admin', 'corp_trainee', 'instructor'],
    default: 'trainee',
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: undefined,
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
