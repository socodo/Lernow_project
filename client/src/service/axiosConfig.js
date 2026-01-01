import axios from 'axios'
import useUserStore from '../store/userStore'

// Tạo axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Trước khi gửi request → thêm token vào header
instance.interceptors.request.use((config) => {
  const accessToken = useUserStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    console.log('Response data axios=>>>>:', response)
    console.log('Response.data:', response.data)
    // Return the actual data from response
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Lỗi 401 (token hết hạn) - có thêm check để tránh circular dependency
    if (error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')) {
      originalRequest._retry = true

      try {
        // Gọi API refresh token (sử dụng axios trực tiếp để tránh circular dependency)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )
        const newAccessToken = response.data.data.accessToken

        // Lưu token mới vào store (memory only)
        useUserStore.getState().setAccessToken(newAccessToken)

        // Thử lại request với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return instance(originalRequest)

      } catch (refreshError) {
        // Refresh thất bại → đăng xuất
        const { logout } = useUserStore.getState()
        logout()

        // Redirect to login
        window.location.href = '/login'

        throw refreshError
      }
    }

    throw error.response?.data || error
  }
)

export default instance
