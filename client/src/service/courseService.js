import apiClient from './axiosConfig'

// Explore API (public)
export const exploreService = {
  // Get all published and approved courses
  getAllCourses: async () => {
    try {
      const response = await apiClient.get('/explore/courses')
      console.log('exploreService.getAllCourses - Raw response:', response)

      // CRITICAL FIX: Backend /explore/courses doesn't return approvalStatus field
      // But it only returns APPROVED courses, so we manually add it
      if (response.courses && Array.isArray(response.courses)) {
        response.courses = response.courses.map(course => ({
          ...course,
          approvalStatus: 'APPROVED', // All courses from this endpoint are APPROVED
          state: course.state || 'PUBLISHED' // Default to PUBLISHED if not present
        }))
        console.log('exploreService.getAllCourses - Added approvalStatus to courses:', response.courses.length)
      }

      return response
    } catch (error) {
      console.error('exploreService.getAllCourses - Error:', error)
      throw error
    }
  },

  // Get specific course details
  getCourseById: async (courseId) => {
    const response = await apiClient.get(`/explore/course/${courseId}`)
    return response
  },

  // Get course content (sections, lessons) for player
  getCourseContent: async (courseId) => {
    const response = await apiClient.get(`/courses/content/${courseId}`)
    return response
  }
}

// Course Management API (instructor)
export const courseService = {
  // Get all courses of logged-in instructor
  getManageCourses: async () => {
    const response = await apiClient.get('/course/manage')
    return response.data
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await apiClient.post('/course/create', courseData)
    return response.data
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/course/update/${courseId}`, courseData)
    return response.data
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await apiClient.delete(`/course/${courseId}`)
    return response.data
  },

  // Request approval for course
  requestApproval: async (courseId, description) => {
    const response = await apiClient.put(`/course/approve_request/${courseId}`, {
      description
    })
    return response.data
  }
}

// Admin Course API
export const adminCourseService = {
  // Get all courses (including APPROVED, PENDING, REJECTED) for admin
  getAllCoursesForAdmin: async () => {
    try {
      // Get all courses from explore (APPROVED only, but missing fields)
      const exploreResponse = await apiClient.get('/explore/courses')
      const approvedCourses = exploreResponse?.courses || []

      // Get pending courses from admin endpoint (has full fields)
      const pendingResponse = await apiClient.get('/admin/course/pending')
      const pendingCourses = pendingResponse?.courses || []

      // Get all courses by merging
      const courseMap = new Map()

      // Add pending courses first (they have full data)
      pendingCourses.forEach(course => {
        courseMap.set(course._id.toString(), course)
      })

      // Add approved courses (but they might have missing fields)
      approvedCourses.forEach(course => {
        if (!courseMap.has(course._id.toString())) {
          // If not in pending, add it (it's an approved course)
          // But set approvalStatus manually since backend doesn't return it
          courseMap.set(course._id.toString(), {
            ...course,
            approvalStatus: 'APPROVED', // Set manually
            state: course.state || 'PUBLISHED' // Default to PUBLISHED
          })
        }
      })

      const allCourses = Array.from(courseMap.values())
      console.log('adminCourseService.getAllCoursesForAdmin - Total:', allCourses.length)

      return { courses: allCourses, total: allCourses.length }
    } catch (error) {
      console.error('adminCourseService.getAllCoursesForAdmin - Error:', error)
      throw error
    }
  },

  // Get all pending courses
  getPendingCourses: async () => {
    try {
      const response = await apiClient.get('/admin/course/pending')
      console.log('adminCourseService.getPendingCourses - Response:', response)
      return response
    } catch (error) {
      console.error('adminCourseService.getPendingCourses - Error:', error)
      // Fallback: Get all courses and filter PENDING on client side
      console.log('Fallback: Fetching all courses and filtering PENDING...')
      const allResponse = await apiClient.get('/explore/courses')
      const allCourses = allResponse?.courses || []
      const pendingCourses = allCourses.filter(c => c.approvalStatus === 'PENDING')
      return { courses: pendingCourses, total: pendingCourses.length }
    }
  },

  // Approve a course
  approveCourse: async (courseId, reason) => {
    const response = await apiClient.put(`/admin/course/approve/${courseId}`, {
      reason
    })
    return response.data
  },

  // Reject a course
  rejectCourse: async (courseId, reason) => {
    const response = await apiClient.put(`/admin/course/reject/${courseId}`, {
      reason
    })
    return response.data
  }
}
