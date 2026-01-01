import { Course } from './../models/course.model';
import { Section } from '../models/section.model';
import { Lesson } from '../models/lesson.model';
import { Enrollment } from '../models/enrollment.model';
import { Request, Response } from 'express'
import { AuthRequest } from '@/middlewares/auth.middleware'

const compactObj = <T extends Record<string, any>>(obj: T) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)) as T;

// path: GET /api/courses/manage
export const getManageCourse = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Query params for filter, search & sort
        const { status, search, sort = 'newest' } = req.query;

        // Build filter
        const filter: any = { creatorId: userId };
        if (status && status !== 'all') {
            filter.state = String(status).toUpperCase();
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Build sort
        let sortOption: any = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'title-asc') {
            sortOption = { title: 1 };
        } else if (sort === 'title-desc') {
            sortOption = { title: -1 };
        }

        // Fetch courses with only needed fields (projection)
        const courses = await Course.find(filter)
            .select('title thumbnailUrl totalLessons totalDuration level tags totalEnrollments averageRating price state approvalStatus createdAt updatedAt')
            .sort(sortOption)
            .lean(); // ← Faster, plain object thay vì Mongoose document

        // Calculate stats (for all user's courses, not filtered)
        const allCourses = await Course.find({ creatorId: userId }).select('state approvalStatus totalEnrollments averageRating totalReviews price');

        const totalStudents = allCourses.reduce((sum, c) => sum + c.totalEnrollments, 0);

        // Average rating: chỉ tính courses có reviews
        const coursesWithReviews = allCourses.filter(c => c.totalReviews > 0);
        const avgRating = coursesWithReviews.length > 0
            ? coursesWithReviews.reduce((sum, c) => sum + c.averageRating, 0) / coursesWithReviews.length
            : 0;

        // Revenue: giả sử mỗi enrollment = 1 lần mua
        const totalRevenue = allCourses.reduce((sum, c) => sum + (c.price.amount * c.totalEnrollments), 0);

        res.status(200).json({
            courses,
            total: courses.length,
            statistics: {
                totalCourses: allCourses.length,
                publishedCourses: allCourses.filter(c => c.state === 'PUBLISHED').length,
                draftCourses: allCourses.filter(c => c.state === 'DRAFT').length,
                totalStudents,
                averageRating: Math.round(avgRating * 10) / 10, // 1 decimal
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCourseContent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if course exists
        const course = await Course.findById(id).populate('creatorId', 'fullName email').lean();
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check enrollment or ownership
        const isCreator = course.creatorId._id.toString() === userId;
        let isEnrolled = false;

        if (!isCreator) {
            const enrollment = await Enrollment.findOne({ userId, courseId: id, status: { $in: ['ENROLLED', 'COMPLETED'] } });
            if (enrollment) isEnrolled = true;
        }

        // If not creator and not enrolled, return 403
        // Note: For development/testing, you might want to comment this out if you haven't set up enrollments yet


        // Fetch sections
        const sections = await Section.find({ courseId: id }).sort({ orderNo: 1 }).lean();

        // Fetch lessons
        const lessons = await Lesson.find({ courseId: id, isVisible: true }).sort({ orderNo: 1 }).lean();

        // Map lessons to sections
        const sectionsWithLessons = sections.map(section => {
            const sectionLessons = lessons.filter(lesson => lesson.sectionId.toString() === section._id.toString());
            return {
                ...section,
                lessons: sectionLessons,
                lessonsCount: sectionLessons.length
            };
        });

        res.status(200).json({
            ...course,
            sections: sectionsWithLessons
        });

    } catch (error) {
        console.error('Error fetching course content:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
    try {
        const creatorId = req.user?.userId;

        if (!creatorId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        const {
            title,
            description,
            price,
            tags,
            level,
            whyChooseThisCourse,
            requirements,
            whatYouWillLearn,
            thumbnailUrl,
        } = req.body ?? {};

        // Validate required fields
        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!description?.trim()) {
            return res.status(400).json({ message: 'Description is required' });
        }
        if (!whyChooseThisCourse?.trim()) {
            return res.status(400).json({ message: 'Why choose this course is required' });
        }
        if (!thumbnailUrl?.trim()) {
            return res.status(400).json({ message: 'Thumbnail is required' });
        }
        if (!price || typeof price.amount !== 'number' || price.amount < 0) {
            return res.status(400).json({ message: 'Valid price is required' });
        }

        // Build course object
        const newCourse: any = {
            title: title.trim(),
            description: description.trim(),
            whyChooseThisCourse: whyChooseThisCourse.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            price: {
                amount: Number(price.amount),
                currency: price.currency || 'VND'
            },
            creatorId,
        };

        // Optional fields
        if (Array.isArray(tags) && tags.length > 0) {
            newCourse.tags = tags.filter((t: string) => t?.trim());
        }
        if (level && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(level)) {
            newCourse.level = level;
        }

        if (Array.isArray(requirements) && requirements.length > 0) {
            newCourse.requirements = requirements.filter((r: string) => r?.trim());
        }
        if (Array.isArray(whatYouWillLearn) && whatYouWillLearn.length > 0) {
            newCourse.whatYouWillLearn = whatYouWillLearn.filter((w: string) => w?.trim());
        }

        const course = await Course.create(newCourse);
        return res.status(201).json(course);

    } catch (error) {
        console.error('Error creating course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateCourse = async (req: AuthRequest, res: Response) => {
    try {
        const courseId = req.params.id;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if course exists
        const course: any = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the creator of the course
        if (userId !== course.creatorId.toString()) {  // ← Sửa từ creatorID thành creatorId
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        // Whitelist các field được phép nhận từ client
        const {
            title,
            description,
            price,               // { amount, currency? }
            tags,                // string[]
            language,            // optional -> default ở schema = 'vi'
            level,               // optional -> default ở schema = 'BEGINNER'
            whyChooseThisCourse,
            requirements,        // string[]
            whatYouWillLearn,    // string[]
            thumbnailUrl,
        } = req.body ?? {};

        // Build update object - chỉ update những field được gửi lên
        const updateData: any = {};

        if (title !== undefined) updateData.title = String(title).trim();
        if (description !== undefined) updateData.description = String(description);
        if (price !== undefined) {
            updateData.price = {
                amount: Number(price.amount),
                currency: price.currency || 'VND'
            };
        }
        if (Array.isArray(tags)) updateData.tags = tags;
        if (language !== undefined) updateData.language = language;
        if (level !== undefined) updateData.level = level;
        if (whyChooseThisCourse !== undefined) updateData.whyChooseThisCourse = whyChooseThisCourse;
        if (Array.isArray(requirements)) updateData.requirements = requirements;
        if (Array.isArray(whatYouWillLearn)) updateData.whatYouWillLearn = whatYouWillLearn;
        if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateData },
            {
                new: true,             // trả về tài liệu sau update
                runValidators: true,   // chạy validator trong schema
            }
        );

        res.status(200).json(updatedCourse);
    }
    catch (error) {
        console.error('Error updating course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteCourse = async (req: AuthRequest, res: Response) => {
    try {
        const courseId = req.params.id;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if course exists
        const course: any = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the creator of the course
        if (userId !== course.creatorId.toString()) {  // ← Sửa từ creatorID thành creatorId
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        await Course.findByIdAndDelete(courseId);
        res.status(204).end();

    }
    catch (error) {
        console.error('Error deleting course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const requestApproval = async (req: AuthRequest, res: Response) => {
    try {
        const courseID = req.params.id;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Check if course exists
        const course: any = await Course.findById(courseID);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the creator of the course
        if (userId !== course.creatorId.toString()) {  // ← Sửa từ creatorID thành creatorId
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this course' });
        }

        if (course.approvalStatus === 'APPROVED') {
            return res.status(200).json({ message: 'Course has already been approved' });
        }

        // Update approvalStatus to 'PENDING'
        const { approvalDescrypt } = req.body;
        if (!approvalDescrypt && course.approvalStatus === 'REJECTED') {
            return res.status(400).json({ message: 'Approval description is required when re-requesting approval after rejection' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseID,
            {
                state: 'PUBLISHED',
                approvalStatus: 'PENDING',
                approvalDescrypt: approvalDescrypt
            },

            {
                new: true,             // trả về tài liệu sau update
                runValidators: true,   // chạy validator trong schema
            }
        );

        res.status(200).json({
            course: updatedCourse.title,
            state: updatedCourse.state,
            approvalStatus: updatedCourse.approvalStatus,
            approvalDescrypt: updatedCourse.approvalDescrypt
        });

    }
    catch (error) {
        console.error('Error requesting course approval:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
