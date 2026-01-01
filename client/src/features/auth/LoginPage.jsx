import { useState } from 'react'
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import Divider from '../../shared/components/form/Divider'
import SocialLoginButtons from './components/SocialLoginButtons'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden max-w-full bg-gray-50">
      <div className="max-w-md w-full space-y-6 bg-white px-8 py-8 rounded-2xl shadow-xl">
        <LoginHeader />

        {/* Unified single Login form (handles both user and admin based on credentials/role) */}
        <LoginForm />
        <Divider />
        <SocialLoginButtons />
      </div>
    </div>
  )
}

export default LoginPage