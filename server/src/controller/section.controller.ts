import { Section } from '../models/section.model';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { Request, Response } from 'express'
import { AuthRequest } from '@/middlewares/auth.middleware'

// GET /api/section/:courseId - Get all sections of a course
export const getSectionsByCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if course exists and user is the creator
        const course: any = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // Get all sections sorted by orderNo
        const sections = await Section.find({ courseId }).sort({ orderNo: 1 });

        res.status(200).json({ sections });
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/section/create - Create a new section
export const createSection = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        const { courseId, title, orderNo } = req.body ?? {};

        // Validate required fields
        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }
        if (!title?.trim()) {
            return res.status(400).json({ message: 'Section title is required' });
        }
        if (orderNo === undefined || orderNo < 0) {
            return res.status(400).json({ message: 'Valid order number is required' });
        }

        // Check if course exists and user is the creator
        const course: any = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (userId !== course.creatorId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // Create section
        const section = await Section.create({
            courseId,
            title: title.trim(),
            orderNo: Number(orderNo)
        });

        res.status(201).json(section);
    } catch (error: any) {
        console.error('Error creating section:', error);
        
        // Handle duplicate orderNo error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A section with this order number already exists for this course' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /api/section/:id - Update a section
export const updateSection = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if section exists
        const section: any = await Section.findById(id);
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

        const { title, orderNo } = req.body ?? {};

        // Build update object
        const updateData: any = {};
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({ message: 'Section title cannot be empty' });
            }
            updateData.title = title.trim();
        }
        if (orderNo !== undefined) {
            if (orderNo < 0) {
                return res.status(400).json({ message: 'Order number must be non-negative' });
            }
            updateData.orderNo = Number(orderNo);
        }

        const updatedSection = await Section.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json(updatedSection);
    } catch (error: any) {
        console.error('Error updating section:', error);
        
        // Handle duplicate orderNo error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A section with this order number already exists for this course' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /api/section/:id - Delete a section
export const deleteSection = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if section exists
        const section: any = await Section.findById(id);
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

        // Delete all lessons in this section first
        await Lesson.deleteMany({ sectionId: id });

        await Section.findByIdAndDelete(id);
        
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};