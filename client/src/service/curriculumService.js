import apiClient from './axiosConfig'

export const sectionService = {
  // Get all sections of a course
  getSectionsByCourse: async (courseId) => {
    // Add timestamp to prevent caching
    const response = await apiClient.get(`/section/${courseId}?_t=${Date.now()}`)
    return response
  },

  // Create new section
  createSection: async (sectionData) => {
    const response = await apiClient.post('/section/create', sectionData)
    return response
  },

  // Update section
  updateSection: async (sectionId, sectionData) => {
    const response = await apiClient.put(`/section/${sectionId}`, sectionData)
    return response
  },

  // Delete section
  deleteSection: async (sectionId) => {
    const response = await apiClient.delete(`/section/${sectionId}`)
    return response
  }
}

export const lessonService = {
  // Get all lessons of a section
  getLessonsBySection: async (sectionId) => {
    // Add timestamp to prevent caching
    const response = await apiClient.get(`/lesson/section/${sectionId}?_t=${Date.now()}`)
    return response
  },

  // Create new lesson
  createLesson: async (lessonData) => {
    const response = await apiClient.post('/lesson/create', lessonData)
    return response
  },

  // Update lesson
  updateLesson: async (lessonId, lessonData) => {
    const response = await apiClient.put(`/lesson/${lessonId}`, lessonData)
    return response
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    const response = await apiClient.delete(`/lesson/${lessonId}`)
    return response
  }
}
