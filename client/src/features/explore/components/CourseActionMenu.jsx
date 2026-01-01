import { useState, useRef, useEffect } from 'react'

const CourseActionMenu = ({ course, onApprove, onReject }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleAction = (action) => {
    setIsOpen(false)
    if (action === 'approve') {
      onApprove(course)
    } else if (action === 'reject') {
      onReject(course)
    }
  }

  return (
    <div className="absolute top-2 left-2 z-20" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation() // Prevent card navigation
          setIsOpen(!isOpen)
        }}
        className="p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Course actions"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('approve')
            }}
            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
          >
            <span>✓</span>
            <span>Approve</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('reject')
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <span>✗</span>
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseActionMenu
