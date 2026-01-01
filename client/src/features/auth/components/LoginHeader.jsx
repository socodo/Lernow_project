const LoginHeader = () => {
  return (
    <div className="text-center">
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold leading-none mb-2">
          <span className="text-black">Learn</span>
          <span className="text-sky-500">ow</span>
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Online Course Platform
        </p>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-600">
        Sign in to continue your learning journey
      </p>
    </div>
  )
}

export default LoginHeader
