import mongoose, { Schema } from 'mongoose';

const Answers = new Schema({
  answer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const ExerciseSchema = new Schema({
  questions: {
    type: [
      {
        // questionId: {
        //   type: String,
        //   required: false,
        //   unique: true,
        //   default: mongoose.Types.ObjectId,
        // },
        question: {
          type: String,
          required: true,
        },
        answers: {
          type: [Answers],
          required: true,
          validate: [arrayLimit, 'You need to have 4 answers'],
        },
      },
    ],
  },
});
function arrayLimit(val: any) {
  return val.length == 4;
}

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
    required: false,
  },
  order: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  exercise: {
    type: ExerciseSchema,
    required: false,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: {
      amount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      validUntil: Date,
    },
    required: false,
  },
  finalExam: {
    type: ExerciseSchema,
    required: false,
  },
  views: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
    ],
    required: false,
  },

  enrolled: {
    type: [
      {
        studentId: {
          type: String,
          required: true,
          unique: true,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
          required: false,
        },
        review: {
          type: String,
          required: false,
        },
        exercises: {
          required: false,
          type: [
            {
              exerciseId: {
                type: String,
                required: false,
              },
              answers: {
                type: [
                  {
                    // answerId
                    type: String,
                    required: false,
                  },
                ],
                required: false,
              },
              score: {
                type: Number,
                required: false,
              },
              submittedAt: {
                type: Date,
                required: false,
                default: Date.now,
              },
              viewedCorrectAnswers: {
                type: Boolean,
                required: false,
                default: false,
              },
            },
          ],
        },
        finalExam: {
          type: {
            submitted: {
              type: Boolean,
              required: false,
            },
            answers: {
              type: [
                {
                  // answerId
                  type: String,
                  required: false,
                },
              ],
              required: false,
            },
            score: {
              type: Number,
              required: false,
            },
            submittedAt: {
              type: Date,
              required: false,
            },
            viewedCorrectAnswers: {
              type: Boolean,
              required: false,
            },
          },
          required: false,
        },
      },
    ],
    required: false,
  },
  isPublished: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
