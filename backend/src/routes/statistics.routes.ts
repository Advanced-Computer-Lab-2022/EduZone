import { Router } from 'express';
import mongoose from 'mongoose';
import { JWTAccessDecoder } from '../middlewares/jwt';
import {
  getAdminStatistics,
  getInstructorStatistics,
} from '../services/statistics.service';
const router = Router();

router.get('/', JWTAccessDecoder, async (req, res) => {
  const { view } = req.query;
  const { role } = req.body.token;
  if (view === 'admin') {
    if (role !== 'admin') {
      return res.status(403).json({
        message: 'You are not authorized to view admin statistics',
      });
    }
    const statistics = await getAdminStatistics();
    return res.status(200).json(statistics);
  }
  if (view === 'instructor') {
    if (role !== 'instructor') {
      return res.status(403).json({
        message: 'You are not authorized to view instructor statistics',
      });
    }
    const statistics = await getInstructorStatistics(
      new mongoose.Types.ObjectId(req.body.token.id)
    );
    return res.status(200).json(statistics);
  }
});

export default router;
