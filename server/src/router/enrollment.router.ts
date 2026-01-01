import express from 'express';
import { enrollCourse, getMyEnrollments, checkEnrollment } from '@/controller/enrollment.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/enroll/:courseId', enrollCourse);
router.get('/my-courses', getMyEnrollments);
router.get('/check/:courseId', checkEnrollment);

export default router;
