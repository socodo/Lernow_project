import { Lesson } from '../models/lesson.model';
import { Section } from '../models/section.model';
import { Course } from '../models/course.model';
import { Request, Response } from 'express'
import { AuthRequest } from '@/middlewares/auth.middleware'

// GET /api/lesson/section/:sectionId - Get all lessons of a section
export const getLessonsBySection = async (req: AuthRequest, res: Response) => {
    try {
        const { sectionId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if section exists
        const section: any = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Check if user is the creator of the course
        const course: any = await Course.findById(section.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // Get all lessons sorted by orderNo
        const lessons = await Lesson.find({ sectionId }).sort({ orderNo: 1 });

        res.status(200).json({ lessons });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/lesson/create - Create a new lesson
export const createLesson = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        const {
            courseId,
            sectionId,
            title,
            shortDesc,
            orderNo,
            lessonType,
            url,
            publicId,
            isVisible
        } = req.body ?? {};

        // Validate required fields
        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }
        if (!sectionId) {
            return res.status(400).json({ message: 'Section ID is required' });
        }
        if (!title?.trim()) {
            return res.status(400).json({ message: 'Lesson title is required' });
        }
        if (!lessonType || !['VIDEO', 'FILE'].includes(lessonType)) {
            return res.status(400).json({ message: 'Valid lesson type (VIDEO or FILE) is required' });
        }
        if (orderNo === undefined || orderNo < 0) {
            return res.status(400).json({ message: 'Valid order number is required' });
        }

        // Check if section exists
        const section: any = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Check if courseId matches section's courseId
        if (section.courseId.toString() !== courseId) {
            return res.status(400).json({ message: 'Section does not belong to this course' });
        }

        // Check if user is the creator of the course
        const course: any = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // Build lesson object
        const lessonData: any = {
            courseId,
            sectionId,
            title: title.trim(),
            orderNo: Number(orderNo),
            lessonType,
            isVisible: isVisible !== undefined ? isVisible : true
        };

        if (shortDesc) lessonData.shortDesc = shortDesc.trim();
        if (url) lessonData.url = url.trim();
        if (publicId) lessonData.publicId = publicId.trim();

        // Create lesson
        const lesson = await Lesson.create(lessonData);

        res.status(201).json(lesson);
    } catch (error: any) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /api/lesson/:id - Update a lesson
export const updateLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if lesson exists
        const lesson: any = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is the creator of the course
        const course: any = await Course.findById(lesson.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        const {
            title,
            shortDesc,
            orderNo,
            url,
            publicId,
            isVisible
        } = req.body ?? {};

        // Build update object
        const updateData: any = {};

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({ message: 'Lesson title cannot be empty' });
            }
            updateData.title = title.trim();
        }
        if (shortDesc !== undefined) updateData.shortDesc = shortDesc.trim();
        if (orderNo !== undefined) {
            if (orderNo < 0) {
                return res.status(400).json({ message: 'Order number must be non-negative' });
            }
            updateData.orderNo = Number(orderNo);
        }
        if (url !== undefined) updateData.url = url.trim();
        if (publicId !== undefined) updateData.publicId = publicId.trim();
        if (isVisible !== undefined) updateData.isVisible = isVisible;

        const updatedLesson = await Lesson.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/lesson/:id - Delete a lesson
export const deleteLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if lesson exists
        const lesson: any = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user is the creator of the course
        const course: any = await Course.findById(lesson.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // TODO: Delete associated video/file from Cloudinary if exists
        // if (lesson.publicId) {
        //     await fileService.delete(lesson.publicId);
        // }

        await Lesson.findByIdAndDelete(id);
        
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
