import axios from './axiosConfig'

export const authService = {
  signin: async (req) => {
    const response = await axios.post('/auth/signin', req)
    return response
  },

  // Alias for backward compatibility
  login: async (req) => {
    return authService.signin(req)
  },

  signup: async (req) => {
    const response = await axios.post('/auth/signup', req)
    return response
  },

  fetchMe: async () => {
    const response = await axios.get('/user/me')
    console.log('fetch me response:', response)
    return response
  },

  // Alias for backward compatibility
  getMe: async () => {
    return authService.fetchMe()
  },

  updateProfile: async (profileData) => {
    const response = await axios.patch('/user/profile', profileData)
    console.log('update profile response:', response)
    return response
  },

  refreshToken: async () => {
    const response = await axios.post('/auth/refresh-token')
    return response
  },

  logout: async () => {
    const response = await axios.post('/auth/logout')
    return response
  }
}

export const courseService = {
  createCourse: async (req) => {
    const response = await axios.post('/courses/create', req)
    return response
  }
}

export const exploreService = {
  getAllCourses: async () => {
    const response = await axios.get('/explore/courses')
    return response
  },
  getCourseById: async (courseId) => {
    const response = await axios.get(`/explore/course/${courseId}`)
    return response
  }
}

export const fileService = {
  upload: async (formData) => {
    const response = await axios.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  delete: async (publicId) => {
    // DELETE with body requires wrapping data in 'data' key (axios syntax)
    const response = await axios.delete('/files/remove', {
      data: { publicId }  // Must use 'data' key for DELETE body
    })
    return response
  }
}

export const adminService = {
  getPendingCourses: () => {
    return axios.get('admin/course/pending')
  },
  approveCourse: (courseId, data) => {
    return axios.put(`admin/course/approve/${courseId}`, data)
  },
  rejectCourse: (courseId, data) => {
    return axios.put(`admin/course/reject/${courseId}`, data)
  }
}
