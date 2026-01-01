import { create } from 'zustand'
import { exploreService } from '../service/apiService'

const useCoursesStore = create((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  setCourses: (courses) => set({ courses }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchAllCourses: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await exploreService.getAllCourses()

      // Chuẩn hóa dữ liệu trả về
      let coursesArray = []

      if (response) {
        if (Array.isArray(response)) {
          coursesArray = response
        } else if (response.courses && Array.isArray(response.courses)) {
          coursesArray = response.courses
        } else if (response.data && Array.isArray(response.data.courses)) {
          coursesArray = response.data.courses
        } else if (response.data && Array.isArray(response.data)) {
          coursesArray = response.data

        }
      }

      console.log('Parsed courses array:', coursesArray)

      if (coursesArray.length > 0) {
        set({
          courses: coursesArray,
          isLoading: false
        })
      } else {
        set({
          courses: [],
          error: 'No courses data found',
          isLoading: false
        })
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      set({
        error: error?.message || 'Failed to fetch courses',
        isLoading: false
      })
    }
  }
}))

export default useCoursesStore
