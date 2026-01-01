import { Course } from './../models/course.model';
import { Request, Response } from 'express'

export const exploreCourse = async (req: Request, res: Response) => {
    try {
        // Chỉ select các field cần thiết cho danh sách course
        const courses = await Course.find(
            { state: 'PUBLISHED', approvalStatus: 'APPROVED' }
        ).select(
            '_id title description thumbnailUrl price level ' +
            'averageRating totalEnrollments totalReviews total totalDuration totalLessons creatorId '
        )
            .populate('creatorId', 'fullName email') // Populate creator info
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

        res.status(200).json({
            total: courses.length,
            courses: courses
        });
    }
    catch (error) {
        console.error('Error fetching courses:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const exploreSpecificCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.id;

        // Lấy toàn bộ thông tin course, loại bỏ các field admin/internal
        const course = await Course.findOne({
            _id: courseId,
            state: 'PUBLISHED',
            approvalStatus: 'APPROVED'
        })
            .select('-approvalStatus -approvalReason -state -decidedBy')
            .populate('creatorId', 'fullName email'); // Populate creator info

        if (!course) {
            return res.status(404).json({ message: 'Course not found or not available' });
        }

        res.status(200).json(course);

    }
    catch (error) {
        console.error('Error fetching course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }

}