import mongoose, { Schema } from 'mongoose';

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
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  img: {
    type: String,
    default: null,
  },
  feedback: {
    type: [
      {
        student: {
          type: String,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        review: {
          type: String,
        },
      },
    ],
    required: false,
  },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
