import { Request, Response } from 'express';
import { AuthRequest } from '@/middlewares/auth.middleware';
import { Enrollment } from '@/models/enrollment.model';
import { Course } from '@/models/course.model';

// POST /api/enrollments/enroll/:courseId
export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Create enrollment
    const newEnrollment = await Enrollment.create({
      userId,
      courseId,
      enrolledAt: new Date(),
      status: 'ENROLLED',
      progress: 0,
      enrollmentType: course.price.amount > 0 ? 'PAID' : 'FREE' // Simple logic for now
    });

    // Increment totalEnrollments in Course
    await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });

    res.status(201).json({ message: 'Enrolled successfully', enrollment: newEnrollment });

  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/enrollments/my-courses
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const enrollments = await Enrollment.find({ userId })
      .populate({
        path: 'courseId',
        select: 'title thumbnailUrl description level totalLessons totalDuration averageRating creatorId',
        populate: {
          path: 'creatorId',
          select: 'fullName'
        }
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json(enrollments);

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/enrollments/check/:courseId
export const checkEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });

    res.status(200).json({ isEnrolled: !!enrollment });

  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
