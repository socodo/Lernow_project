import { useState, useEffect } from 'react'
import FormInput from '../../../shared/components/form/FormInput'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../../store/userStore'

const LoginForm = () => {
  const navigate = useNavigate()
  const { signin, loading } = useUserStore()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loginError, setLoginError] = useState(null) // State riêng cho error

  // Reset error khi vào trang
  useEffect(() => {
    setLoginError(null)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError(null) // Reset error trước khi submit

    try {
      await signin({
        email: formData.email,
        password: formData.password
      })

      // Redirect về trang chủ sau khi login thành công
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
      setLoginError(err.message || 'Login failed. Please try again.')
    }
  }

  const handleClear = () => {
    setFormData({
      email: '',
      password: ''
    })
  }



  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {loginError}
        </div>
      )}

      <div className="space-y-4">
        <FormInput
          id="email"
          name="email"
          type="text"
          label="Email or Username"
          placeholder="Enter your email or username"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="checkbox-primary"
          />
          <label htmlFor="remember-me" className="form-label-inline">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="link-primary">
            Forgot password?
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="#" className="link-primary" onClick={() => navigate('/register')}>
            Sign up now
          </a>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
