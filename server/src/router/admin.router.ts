import express from 'express';
import {
    getPendingCourses,
    approveCourse,
    rejectCourse
} from '@/controller/admin.controller';

const router = express.Router()

router.get('/course/pending', getPendingCourses)
router.put('/course/approve/:id', approveCourse)
router.put('/course/reject/:id', rejectCourse)

export default router