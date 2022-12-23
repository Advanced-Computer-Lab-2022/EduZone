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
  reportedProblems: {
    type: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        course: {
          type: String,
          required: true,
        },
        problemType: {
          type: String,
          required: true,
        },
        problem: {
          type: String,
          required: true,
        },
        reportedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        status: {
          type: String,
          default: 'UNSEEN',
        },
        followUp: {
          type: String,
          required: false,
        },
        resolvedAt: {
          type: Date,
          required: false,
        },
      },
    ],
    required: false,
  },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
