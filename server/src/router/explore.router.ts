import express from 'express';
import { exploreCourse, exploreSpecificCourse  } from '@/controller/explore.controller';
import e from 'express';

const router = express.Router();

router.get('/courses', exploreCourse);

router.get('/course/:id', exploreSpecificCourse);

export default router;