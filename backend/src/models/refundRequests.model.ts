import mongoose, { Schema } from 'mongoose';

const RefundRequestSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'PENDING',
  },
  requestedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    required: false,
  },
});

const RefundRequestModel = mongoose.model('RefundRequest', RefundRequestSchema);
export default RefundRequestModel;
