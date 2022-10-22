import express from 'express';
import { addCourse, getCourseById, updateCourseById } from '../controllers';

const router = express.Router();

//Add new Course Route
router.post('/', async (req, res) => {
  const { title, instructor } = req.body;
  if (!title || !instructor) {
    return res.status(400).json({
      message: 'Please fill all the fields',
    });
  }
  return res.status(201).json(await addCourse(instructor, title));
});

//get Course By ID Route
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await getCourseById(id));
});

//Update Course By ID Route
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, instructor } = req.body;
  res.status(200).json(await updateCourseById(id, instructor, title));
});

export default router;
