import express from 'express';
import Exception from '../Exceptions/Exception';
import { JWTAccessDecoder } from '../middlewares/jwt';
import {
  addUser,
  getAllUsers,
  getUserReportedProblems,
  getUserById,
  getUserByName,
  rateInstructor,
  reviewInstructor,
  updateUser,
  getNotifications,
} from '../services';

const router = express.Router();

//Create new User Route
router.post('/', async (req, res) => {
  try {
    const data = req.body as any;
    if (!data) {
      return res.status(400).json({
        message: 'Bad Request Body',
      });
    }
    return res.status(201).json(await addUser(data));
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

//get User By ID Route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json(user);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/:id/problems', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.params;
    const reportedProblems = await getUserReportedProblems(id);
    return res.status(200).json(reportedProblems);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

//get user by name Route
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const user = await getUserByName(name);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json(user);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});
//Read all users Route
router.get('/', async (req, res) => {
  try {
    res.status(200).json(await getAllUsers());
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body as any;
    if (!data) {
      return res.status(400).json({
        message: 'Bad Request Body',
      });
    }
    const user = await updateUser(id, data);
    res.status(202).json(user);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/rate', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;
  const { rating } = req.body;
  try {
    const instructor: any = await rateInstructor(id, userId, Number(rating));
    if (!instructor) {
      return res.status(404).json({
        message: 'instructor not found',
      });
    }
    return res.status(200).json(instructor);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/review', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;
  const { review } = req.body;
  try {
    const instructor: any = await reviewInstructor(id, userId, review);
    if (!instructor) {
      return res.status(404).json({
        message: 'instructor not found',
      });
    }
    return res.status(200).json(instructor);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/:id/notifications', async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await getNotifications(id);
    return res.status(200).json(notifications);
  } catch (e) {
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

export default router;
