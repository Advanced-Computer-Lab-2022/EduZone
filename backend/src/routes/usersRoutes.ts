import express from 'express';
import { addUser } from '../controllers';

const router = express.Router();

//Create new User Route
router.post('/', async (req, res) => {
  try {
    const data = req.body as any;
    if (!data) {
      return res.status(400).json(await addUser(data));
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
    const user = { name: 'john Doe' }; //await getUserById(id);
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
    res.status(200).json({
      name: 'John Doe',
      email: 'example@example.com',
    });
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
  }
});

export default router;
