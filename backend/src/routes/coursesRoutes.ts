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
  problemFollowUp,
  publishCourse,
  rateCourse,
  reportProblem,
  reviewCourse,
  traineeSubmitFinalExam,
  traineeSubmitSubtitleExercise,
  updateCourseById,
  updateSubtitleByCourseAndId,
  getReportedProblems,
  updateProblemStatus,
  requestCourseRefund,
  cancelRefundRequest,
  requestAccessToCourse,
  getRefundRequests,
  getCourseAccessRequests,
  resolveRefundRequest,
  resolveAccessRequest,
  addBatchPromotion,
  enrollFree,
} from '../services';
import Exception from '../Exceptions/Exception';

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
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
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
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/trainee', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.body.token;
    const courses = await getTraineeCourses(id);
    return res.status(200).json(courses);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/problems', JWTAccessDecoder, async (req, res) => {
  try {
    const problems = await getReportedProblems();
    return res.status(200).json(problems);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/refund-requests', JWTAccessDecoder, async (req, res) => {
  try {
    const { id, role } = req.body.token;
    const requests = await getRefundRequests(role, id);
    return res.status(200).json(requests);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch(
  '/refund-requests/:requestId',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { role } = req.body.token;
      if (role !== 'admin') {
        return res
          .status(403)
          .json({ error: 'You are not allowed to perform this request' });
      }
      const { requestId } = req.params;
      const { courseId, amount, studentId, status } = req.body;
      const request = await resolveRefundRequest(
        courseId,
        studentId,
        requestId,
        status,
        amount
      );
      return res.status(200).json(request);
    } catch (e) {
      if (e instanceof Exception) {
        console.error(e);
        return res.status(e.statusCode).json({ error: e.message });
      }
      return res.status(500).json({ error: (e as any).message });
    }
  }
);
router.patch(
  '/access-requests/:requestId',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { role } = req.body.token;
      if (role !== 'admin') {
        return res
          .status(403)
          .json({ error: 'You are not allowed to perform this request' });
      }
      const { requestId } = req.params;
      const { courseId, amount, studentId, status } = req.body;
      const request = await resolveAccessRequest(
        courseId,
        studentId,
        requestId,
        status
      );
      return res.status(200).json(request);
    } catch (e) {
      if (e instanceof Exception) {
        console.error(e);
        return res.status(e.statusCode).json({ error: e.message });
      }
      return res.status(500).json({ error: (e as any).message });
    }
  }
);

router.post('/batch-promotions', JWTAccessDecoder, async (req, res) => {
  try {
    const { role } = req.body.token;
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You are not allowed to perform this request' });
    }
    const { courseIds, amount, validFrom, validUntil } = req.body;
    const batchPromotions = await addBatchPromotion(
      courseIds,
      amount,
      validFrom,
      validUntil
    );
    return res.status(200).json(batchPromotions);
  } catch (e) {
    if (e instanceof Exception) {
      console.error(e);
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/access-requests', JWTAccessDecoder, async (req, res) => {
  try {
    const { id, role } = req.body.token;
    const requests = await getCourseAccessRequests(role, id);
    return res.status(200).json(requests);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.get('/:id/problems', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: userId, role } = req.body.token;
    const { id: courseId } = req.params;

    // const course = await reportProblem(
    //   courseId,
    //   studentId,
    //   problem.type,
    //   problem.description
    // );
    // return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.post('/:id/problems', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: userId } = req.body.token;
    const { id: courseId } = req.params;
    const { problem } = req.body;
    if (!problem) {
      return res.status(400).json({ error: 'Problem is required' });
    }
    const course = await reportProblem(
      courseId,
      userId,
      problem.type,
      problem.description
    );
    return res.status(201).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.patch('/:id/problems/:problemId', JWTAccessDecoder, async (req, res) => {
  try {
    const { id: courseId, problemId } = req.params;
    const { status, userId } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    if (
      status.toLowerCase() !== 'resolved' &&
      status.toLowerCase() !== 'unseen' &&
      status.toLowerCase() !== 'pending'
    )
      return res.status(400).json({ error: 'Status is invalid' });
    const problem = await updateProblemStatus(
      courseId,
      userId,
      problemId,
      status.toUpperCase()
    );
    return res.status(200).json(problem);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.post(
  '/:id/problems/:problemId/followup',
  JWTAccessDecoder,
  async (req, res) => {
    try {
      const { id: userId } = req.body.token;
      const { id: courseId, problemId } = req.params;
      const { followup } = req.body;
      if (!followup) {
        return res.status(400).json({ error: 'Problem is required' });
      }

      const problems = await problemFollowUp(
        courseId,
        userId,
        problemId,
        followup
      );

      return res.status(202).json(problems);
    } catch (e) {
      if (e instanceof Exception) {
        console.error(e);
        return res.status(e.statusCode).json({ error: e.message });
      }
      return res.status(500).json({ error: (e as any).message });
    }
  }
);

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
      if (e instanceof Exception) {
        console.error(e);
        return res.status(e.statusCode).json({ error: e.message });
      }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

//Update Course By ID Route
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    res.status(200).json(await updateCourseById(id, data));
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
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
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
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
      if (e instanceof Exception) {
        console.error(e);
        return res.status(e.statusCode).json({ error: e.message });
      }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});
router.patch('/:id/enroll', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, email } = req.body.token;
    const course = await enrollFree(id, userId);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
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
    const course = await rateCourse(id, userId, rating);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
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
    const course = await reviewCourse(id, userId, review);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});

router.post('/:id/request-access', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: studentId, role } = req.body.token;

  try {
    const course = await requestAccessToCourse(id, studentId, role);
    return res.status(201).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});
router.patch('/:id/refund', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;

  try {
    const course = await requestCourseRefund(id, userId);
    return res.status(201).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
    return res.status(500).json({ error: (e as any).message });
  }
});
router.delete('/:id/refund', JWTAccessDecoder, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body.token;

  try {
    const course = await cancelRefundRequest(id, userId);
    return res.status(200).json(course);
  } catch (e) {
    console.error(e);
    if (e instanceof Exception) {
      return res.status(e.statusCode).json({ error: e.message });
    }
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
      if (e instanceof Exception) {
        return res.status(e.statusCode).json({ error: e.message });
      }
      return res.status(500).json({ error: (e as any).message });
    }
  }
);

export default router;
