import SignUpHeader from './components/SignUpHeader'
import { SignUpForm } from './components/SignUpForm'

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <SignUpHeader />
        </div>

        {/* Registration Form - User only */}
        <SignUpForm registerType="user" />
      </div>
    </div>
  )
}

export default RegisterPage
