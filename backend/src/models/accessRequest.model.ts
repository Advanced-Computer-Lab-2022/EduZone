import mongoose, { Schema } from 'mongoose';

const AccessRequestSchema = new Schema({
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

const AccessRequestModel = mongoose.model('AccessRequest', AccessRequestSchema);

export default AccessRequestModel;
