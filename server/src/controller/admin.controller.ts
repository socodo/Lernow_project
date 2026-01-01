import { Course } from '@/models/course.model'
import { AuthRequest } from '@/middlewares/auth.middleware'
import { Request, Response } from 'express'

export const getPendingCourses = async (req: Request, res: Response) => {
    try {
        // retrive all pending courses
        const pendingCourses = await Course.find({ approvalStatus: 'PENDING', state: 'PUBLISHED' }).sort({ createdAt: -1 });

        res.status(200).json({
            total: pendingCourses.length,
            courses: pendingCourses
        });
    }
    catch (error) {
        console.error('Error fetching pending courses:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const approveCourse = async (req: AuthRequest, res: Response) => {
    try {
        const courseId = req.params.id;
        const adminId = req.user?.userId;

        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { reason } = req.body;

        const course = await Course.findByIdAndUpdate(courseId, {
            approvalStatus: 'APPROVED',
            approvalReason: reason,
            state: 'PUBLISHED',
            publishedAt: new Date(),
            decidedBy: adminId
        }, {
            new: true,             // trả về tài liệu sau update
            runValidators: true,   // chạy validator trong schema
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course approved successfully', course });
    }
    catch (error) {
        console.error('Error approving course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const rejectCourse = async (req: AuthRequest, res: Response) => {
    try {
        const courseId = req.params.id;
        
        const { reason } = req.body;
        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const course = await Course.findByIdAndUpdate(courseId, {
            approvalStatus: 'REJECTED',
            approvalReason: reason
        }, {
            new: true,             // trả về tài liệu sau update
            runValidators: true,   // chạy validator trong schema
        });
        
        res.status(200).json({ message: 'Course rejected successfully', course });
    }
    catch (error) {
        console.error('Error rejecting course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}