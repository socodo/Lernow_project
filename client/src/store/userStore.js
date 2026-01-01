import { authService } from '../service/apiService'
import { create } from 'zustand'

const useUserStore = create((set, get) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: null,
  loading: false,
  error: null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',

  signin: async (credentials) => {
    try {
      set({ loading: true, error: null })
      const response = await authService.signin(credentials)
      // Normalize response shape: some services return { data: { accessToken, user } }
      // while axios interceptor may already unwrap to the body. Support both.
      const body = response?.data ?? response
      const payload = body?.data ?? body
      const accessToken = payload?.accessToken ?? payload?.access_token ?? null
      const rawUser = payload?.user ?? payload?.userData ?? null

      // Normalize user role to lowercase for consistency
      const user = rawUser ? {
        ...rawUser,
        role: (rawUser.role || 'user').toLowerCase()
      } : null

      localStorage.setItem('isAuthenticated', 'true')
      if (accessToken) localStorage.setItem('accessToken', accessToken)

      set({
        accessToken: accessToken,
        user: user,
        loading: false,
        isAuthenticated: true
      })

      console.log('Đăng nhập thành công', get().user)
      return response
    } catch (error) {
      console.error('Đăng nhập không thành công:', error)
      set({ loading: false, error: error.message || 'Login failed' })
      throw error
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true, error: null })
      const response = await authService.signup(userData)
      const body = response?.data ?? response
      const payload = body?.data ?? body
      const accessToken = payload?.accessToken ?? payload?.access_token ?? null
      const user = payload?.user ?? payload?.userData ?? null

      localStorage.setItem('isAuthenticated', 'true')
      if (accessToken) localStorage.setItem('accessToken', accessToken)

      set({
        accessToken: accessToken,
        user: user,
        loading: false,
        isAuthenticated: true
      })

      console.log('Đăng ký thành công', get().user)
      return response
    } catch (error) {
      console.error('Đăng ký không thành công:', error)
      set({ loading: false, error: error.message || 'Signup failed' })
      throw error
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true, error: null })
      const response = await authService.fetchMe()
      const body = response?.data ?? response
      const payload = body?.data ?? body
      const user = payload?.user ?? payload?.userData ?? null
      console.log("jack", user)

      set({
        user: user,
        loading: false,
        isAuthenticated: true
      })
      return response
    } catch (error) {
      console.error('Fetch me failed:', error)
      set({ loading: false, error: error.message || 'Fetch me failed' })
      throw error
    }
  },

  setAccessToken: (token) => {
    set({ accessToken: token })
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout API failed:', error)
    } finally {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('accessToken')
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        error: null
      })
    }
  }
}))

export default useUserStore