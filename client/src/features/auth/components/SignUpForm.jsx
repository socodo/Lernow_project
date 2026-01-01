import React, { useState } from 'react'
import FormInput from '../../../shared/components/form/FormInput'
import { authService } from '@/service/apiService'
import useUserStore from '../../../store/userStore'
import { useNavigate } from 'react-router-dom'

export const SignUpForm = ({ registerType = 'user' }) => {
  const navigate = useNavigate()
  const { signin } = useUserStore()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    birthDay: '',
    birthMonth: '',
    birthYear: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { firstName, lastName, email, password, confirmPassword, birthDay, birthMonth, birthYear } = formData

    if (!firstName || !lastName || !email || !password || !confirmPassword || !birthDay || !birthMonth || !birthYear) {
      setError('Please fill all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const fullName = `${formData.firstName} ${formData.lastName}`
    const birthDate = `${formData.birthMonth}/${formData.birthDay}/${formData.birthYear}` // mm/dd/yyyy

    try {
      const response = await authService.signup({
        fullName: fullName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: birthDate
      })

      if (response && response.success && response.data) {
        const user = response.data.user
        const userRole = (user.role || 'user').toLowerCase()
        const expectedRole = registerType.toLowerCase()

        console.log('SignUpForm - User role:', userRole)
        console.log('SignUpForm - Expected role:', expectedRole)

        // Check if role matches the registration type
        if (userRole !== expectedRole) {
          setError(`This email is registered as a ${userRole}. Please use the ${userRole === 'admin' ? 'Admin' : 'User'} Registration.`)
          return
        }

        // Login after successful signup using userStore
        await signin({
          email: formData.email,
          password: formData.password
        })

        navigate(userRole === 'admin' ? '/admin' : '/')
      } else {
        setError(response?.message || 'Signup failed. Please try again.')
      }
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.')
    }
  }





  return (
    <div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* First Name */}
          <div className='flex gap-3'>
            <FormInput
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <FormInput
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

          </div>


          {/* Email */}
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date of birth (mm/dd/yyyy)</label>
            <div className="flex gap-2 items-center">
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                className="input-field placeholder:text-xs px-2 py-1.5 text-sm"
                required
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                ))}
              </select>

              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className="input-field placeholder:text-xs px-2 py-1.5 text-sm"
                required
              >
                <option value="">DD</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                ))}
              </select>

              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className="input-field placeholder:text-xs px-2 py-1.5 text-sm"
                required
              >
                <option value="">YYYY</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return <option key={year} value={String(year)}>{year}</option>
                })}
              </select>
            </div>
          </div>


        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Sign up
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="link-primary">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
