import express from 'express';
import coursesController from '../controllers/coursesController';

const router = express.Router();

//Add new Course Route
router.post('/addCourse', async (req, res) => {
  res
    .status(200)
    .json(
      await coursesController.addCourse(req.body.instructor, req.body.title)
    );
});

//get Course By ID Route
router.get('/getCourse/:id', async (req, res, next) => {
  var id = req.params.id;
  res.status(200).json(await coursesController.getCourseById(id));
});

//Update Course By ID Route
router.patch('/updateCourse/:id', async (req, res, next) => {
  var id = req.params.id;
  res
    .status(200)
    .json(
      await coursesController.updateCourseById(
        id,
        req.body.instructor,
        req.body.title
      )
    );
});

export default { router };
