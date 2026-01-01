import { useState, useEffect } from 'react'
import Logo from './Logo'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ProfileMenu } from '../../../features/auth/components/ProfileMenu'
import useUserStore from '../../../store/userStore'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Lấy từ store và fetch user nếu chưa có
  const { user, fetchMe, isAuthenticated, logout } = useUserStore()

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe()
    }
  }, [isAuthenticated, user, fetchMe])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const showRegisterButton = location.pathname !== '/register' && !isAuthenticated
  const showLoginButton = location.pathname !== '/login' && !isAuthenticated


  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b py-2  border-gray-100">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-full h-16 px-10">
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-16 font-medium text-base text-neutral-900">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 py-1.5 px-2 rounded-md ${isActive
                  ? 'text-sky-500 bg-sky-50 font-semibold'
                  : 'hover:text-sky-500 hover:bg-sky-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `transition-colors duration-200 py-1.5 px-2 rounded-md ${isActive
                  ? 'text-sky-500 bg-sky-50 font-semibold'
                  : 'hover:text-sky-500 hover:bg-sky-50'
                }`
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/tutor-now"
              className={({ isActive }) =>
                `transition-colors duration-200 py-1.5 px-2 rounded-md ${isActive
                  ? 'text-sky-500 bg-sky-50 font-semibold'
                  : 'hover:text-sky-500 hover:bg-sky-50'
                }`
              }
            >
              Tutor Now
            </NavLink>
          </nav>

          {/* Desktop Auth Buttons / Profile Menu */}
          <div className="hidden md:flex items-center space-x-3 font-sans text-sm">
            {isAuthenticated && user ? (
              <ProfileMenu
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <>
                {showRegisterButton && (
                  <NavLink to="/register">
                    <button className="btn-primary">
                      Register
                    </button>
                  </NavLink>
                )}
                {showLoginButton && (
                  <NavLink to="/login">
                    <button className="btn-secondary font-sans px-5">
                      Login
                    </button>
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              {/* Mobile Navigation */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium transition-colors rounded-md ${isActive
                    ? 'text-sky-500 bg-sky-100 font-semibold'
                    : 'text-neutral-900 hover:text-sky-500 hover:bg-sky-50'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium transition-colors rounded-md ${isActive
                    ? 'text-sky-500 bg-sky-100 font-semibold'
                    : 'text-neutral-900 hover:text-sky-500 hover:bg-sky-50'
                  }`
                }
              >
                Explore
              </NavLink>
              <NavLink
                to="/tutor-now"
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium transition-colors rounded-md ${isActive
                    ? 'text-sky-500 bg-sky-100 font-semibold'
                    : 'text-neutral-900 hover:text-sky-500 hover:bg-sky-50'
                  }`
                }
              >
                Tutor Now
              </NavLink>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-2 space-y-2">
                {showRegisterButton && (
                  <NavLink to="/register" className="block">
                    <button className="btn-primary font-sans w-full">
                      Register
                    </button>
                  </NavLink>
                )}
                {showLoginButton && (
                  <NavLink to="/login" className="block">
                    <button className="btn-secondary font-sans w-full">
                      Login
                    </button>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header