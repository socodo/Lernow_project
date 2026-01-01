import { Router } from 'express';
import {
  getLessonsBySection,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controller/lesson.controller';

const lessonRouter = Router();

// Get all lessons of a section
lessonRouter.get('/section/:sectionId', getLessonsBySection);

// Create new lesson
lessonRouter.post('/create', createLesson);

// Update lesson
lessonRouter.put('/:id', updateLesson);

// Delete lesson
lessonRouter.delete('/:id', deleteLesson);

export default lessonRouter;
