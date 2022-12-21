import express from 'express';
import { JWTAccessDecoder } from '../middlewares/jwt';
import fs from 'fs';
import {
  addCourse,
  addSubtitleExercise,
  addSubtitleNote,
  buyCourse,
  completeCourseItem,
  createFinalExercise,
  deleteCourseById,
  finishCourse,
  getAllCourses,
  getCourseById,
  getCourseCertificate,
  getMostPopularCourses,
  getSubtitleByCourseAndId,
  getTraineeCourses,
  publishCourse,
  rateCourse,
  reviewCourse,
  traineeSubmitFinalExam,
  traineeSubmitSubtitleExercise,
  updateCourseById,
  updateSubtitleByCourseAndId,
} from '../services';

const router = express.Router();

router.get('/', async (req, res) => {
  const { page, limit, ...filters } = req.query;

  try {
    const courses = await getAllCourses(
      filters,
      page as string,
      limit as string
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: (error as any).message, stack: error });
  }
});

//Add new Course Route
router.post('/', JWTAccessDecoder, async (req, res) => {
  try {
    const data = req.body as any;
    if (!data) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    return res.status(201).json(await addCourse(data));
  } catch (error) {
    return res
      .status(500)
      .json({ message: (error as any).message, stack: error });
  }
});

router.get('/trainee', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.body.token;
    const courses = await getTraineeCourses(id);
    return res.status(200).json(courses);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { limit } = req.query;
    const courses: any = await getMostPopularCourses(Number(limit ?? 5));
    return res.status(200).json(courses);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/finish', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: studentId, name, email } = req.body.token;
    const { id: courseId } = req.params;
    const course = await finishCourse(courseId, studentId, name, email);
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.put(
  '/:id/subtitles/:subtitleId/notes',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { id: studentId } = req.body.token;
      const { id: courseId, subtitleId } = req.params;
      const { notes } = req.body;
      if (!notes) {
        return res.status(400).json({ error: 'Notes are required' });
      }
      const course = await addSubtitleNote(
        courseId,
        subtitleId,
        studentId,
        notes
      );
      return res.status(200).json(course);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: (e as any).message });
    }
  }
);

router.get('/:id/certificate', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: studentId } = req.body.token;
    const { id: courseId } = req.params;
    const certificate = await getCourseCertificate(courseId, studentId);
    console.log(certificate);
    // const file = fs.createReadStream(`${process.cwd()}/${certificate}`);
    // const stat = fs.statSync(`${process.cwd()}/${certificate}`);
    // res.setHeader('Content-Length', stat.size);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=' + certificate);
    // file.pipe(res);
    return res.status(200).json({ certificate: certificate });
    // .json({ certificate: `${process.cwd()}/${certificate}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
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

router.patch('/:id/complete', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: studentId } = req.body.token;
    const { item, itemId } = req.query;
    const { id: courseId } = req.params;
    const course = await completeCourseItem(
      courseId,
      studentId,
      (item as 'exercise' | 'subtitle' | 'finalExam') ?? '',
      (itemId as string) ?? ''
    );
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.post('/:id/exam', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.params;
    const finalExam: any = req.body.finalExam;
    if (!finalExam) {
      return res.status(400).json({
        message: 'Please fill the finalExam field',
      });
    }
    const course = await createFinalExercise(id, finalExam);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
  }
});
router.post('/:id/exam/submit', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: studentId } = req.body.token;
    const { answers } = req.body;
    if (!answers) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    const score = await traineeSubmitFinalExam(id, studentId, answers);
    return res.status(200).json({ score });
  } catch (e) {
    console.error(e);
  }
});

router.post(
  '/:id/subtitles/:subtitleId/exercise',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { id, subtitleId } = req.params;
      const { exercise } = req.body;
      if (!exercise) {
        return res.status(400).json({
          message: 'Please fill all the fields',
        });
      }

      const subtitle = await addSubtitleExercise(id, subtitleId, exercise);
      if (!subtitle) {
        return res.status(404).json({
          message: 'Subtitle not found',
        });
      }
      return res.status(200).json(subtitle);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: (e as any).message });
    }
  }
);
//PUT update subtitle
router.put('/:id/subtitles/:subtitleId', JWTAccessDecoder, async (req, res) => {
  try {
    const { id, subtitleId } = req.params;
    const { subtitle } = req.body;
    if (!subtitle) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    const updatedSub = await updateSubtitleByCourseAndId(
      id,
      subtitleId,
      subtitle
    );
    return res.status(202).json(updatedSub);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/:id/subtitles/:subtitleId', async (req, res) => {
  try {
    const { id, subtitleId } = req.params;
    const subtitle = await getSubtitleByCourseAndId(id, subtitleId);
    if (!subtitle) {
      return res.status(404).json({
        message: 'Subtitle not found',
      });
    }
    return res.status(200).json(subtitle);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/buy', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, email } = req.body.token;
    const { paymentId } = req.body;
    const course = await buyCourse(id, userId, email, paymentId);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/rate', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;
  const { rating } = req.body;
  try {
    const course = await rateCourse(id, userId, rating);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/review', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;
  const { review } = req.body;
  try {
    const course = await reviewCourse(id, userId, review);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/publish', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  try {
    const course = await publishCourse(id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: (e as any).message });
  }
});

/**
courseId: string,
  subtitleId: string,
  studentId: string,
  exerciseId: string,
  data: any
 */

// SUBMIT EXERCISE Answers
router.post(
  '/:id/subtitles/:subtitleId/exercise/:exerciseId',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { id, subtitleId, exerciseId } = req.params;
      const { id: studentId } = req.body.token;
      const { answers } = req.body;
      if (!answers) {
        return res.status(400).json({
          message: 'Please fill all the fields',
        });
      }
      const score = await traineeSubmitSubtitleExercise(
        id,
        subtitleId,
        studentId,
        exerciseId,
        answers
      );

      return res.status(200).json({ score });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: (e as any).message });
    }
  }
);

export default router;
