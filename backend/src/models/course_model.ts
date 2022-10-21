import mongoose, { Schema } from 'mongoose';

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
    type: String,
    require: true,
  },
  rating: {
    type: Number,
  },
  subject: {
    type: String,
    require: true,
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
