import express from 'express';
import {
  addCourse,
  deleteCourseById,
  getCourseById,
  updateCourseById,
} from '../controllers';

const router = express.Router();

//Add new Course Route
router.post('/', async (req, res) => {
  try {
    const data = req.body as any;
    if (!data) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    return res.status(201).json(await addCourse(data));
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
  }
});

//get Course By ID Route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    res.status(200).json(await getCourseById(id));
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Course By ID Route
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    res.status(200).json(await updateCourseById(id, data));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await deleteCourseById(id);
    if (!deletedCourse) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(deletedCourse);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
