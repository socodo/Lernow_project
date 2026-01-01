import express from 'express';

import { createCourse, updateCourse, deleteCourse, getManageCourse, requestApproval, getCourseContent } from '@/controller/course.controller';
import { authorize } from '@/middlewares/auth.middleware';

const router = express.Router();

// Lấy tất cả courses của user đang đăng nhập + thống kê
router.get('/manage', getManageCourse);

// Get course content (sections, lessons) for enrolled user
router.get('/content/:id', getCourseContent);


//@ /api/courses/create
router.post('/create', createCourse);

router.put('/update/:id', updateCourse);

router.delete('/:id', deleteCourse);

router.put('/approve_request/:id', requestApproval)

export default router;