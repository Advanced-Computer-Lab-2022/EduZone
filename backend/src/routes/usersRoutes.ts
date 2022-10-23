import express from 'express';

const router = express.Router();

//Create new User Route
router.post('/', async (req, res) => {
  try {
    const data = req.body as any;
    if (!data) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    return res.status(201).json({
      message: 'User created successfully',
    });
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
