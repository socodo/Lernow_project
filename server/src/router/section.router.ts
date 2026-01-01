import { Router } from 'express';
import {
  getSectionsByCourse,
  createSection,
  updateSection,
  deleteSection
} from '../controller/section.controller';

const sectionRouter = Router();

// Get all sections of a course
sectionRouter.get('/:courseId', getSectionsByCourse);

// Create new section
sectionRouter.post('/create', createSection);

// Update section
sectionRouter.put('/:id', updateSection);

// Delete section
sectionRouter.delete('/:id', deleteSection);

export default sectionRouter;
