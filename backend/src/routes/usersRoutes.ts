import express from 'express';
import {
  addUser,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
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
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
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
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
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
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
  }
});
//Read all users Route
router.get('/', async (req, res) => {
  try {
    res.status(200).json(await getAllUsers());
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
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
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
  }
});

export default router;
