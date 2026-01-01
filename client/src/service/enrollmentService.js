import apiClient from './axiosConfig'

export const enrollmentService = {
  // Enroll in a course
  enrollCourse: async (courseId) => {
    const response = await apiClient.post(`/enrollments/enroll/${courseId}`)
    return response
  },

  // Get my enrollments
  getMyEnrollments: async () => {
    const response = await apiClient.get('/enrollments/my-courses')
    return response
  },

  // Check if enrolled
  checkEnrollment: async (courseId) => {
    const response = await apiClient.get(`/enrollments/check/${courseId}`)
    return response
  }
}
