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
    type: Schema.Types.ObjectId,
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
    type: Array,
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
