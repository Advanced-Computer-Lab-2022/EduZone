import mongoose, { Schema } from 'mongoose';
const SubtitleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  youtube_url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    require: true,
  },
  //TODO change to refrence a user with role instructor
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  subject: {
    type: String,
    require: true,
  },
  subtitles: {
    type: [SubtitleSchema],
    required: false,
  },
  summary: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  preview_video: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
