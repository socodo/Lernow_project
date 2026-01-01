import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../../store/userStore'
import LikeButton from './LikeButton'
import KebabMenu from './KebabMenu'
import BlockCourseModal from './BlockCourseModal'
import ReportCourseModal from './ReportCourseModal'

const CourseCard = ({ course, liked, onLikeToggle, onBlock, onReport, onAdminAction }) => {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const isAdmin = user?.role === 'admin'
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const getCourseColor = (category) => {
    const colors = {
      'IT': 'bg-slate-800',
      'Marketing': 'bg-teal-400',
      'Language': 'bg-orange-400',
      'Design': 'bg-emerald-600',
      'Business': 'bg-emerald-700',
      'Personal Development': 'bg-orange-300'
    }
    return colors[category] || 'bg-gray-600'
  }

  const getCourseIcon = (image) => {
    const icons = {
      'code': '💻',
      'marketing': '🔍',
      'spanish': '📚',
      'design': '🎨',
      'project': '📊',
      'data': '📈',
      'finance': '💰',
      'writing': '✍️',
      'mobile': '📱',
      'photo': '📷',
      'ml': '🤖',
      'strategy': '📋'
    }
    return icons[image] || '📖'
  }

  const handleCardClick = () => {
    navigate(`/course/${course.id}`)
  }

  const handleLikeToggle = () => {
    onLikeToggle(course.id)
  }

  const handleBlockConfirm = (reason) => {
    onBlock(course.id, reason)
    setShowBlockModal(false)
  }

  const handleReportSubmit = (reason) => {
    onReport(course.id, reason)
    setShowReportModal(false)
  }

  // Menu items for regular users
  const userMenuItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#f472b6' : 'none'} stroke={liked ? '#f472b6' : '#6b7280'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      label: liked ? 'Unlike' : 'Like',
      onClick: handleLikeToggle
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
      label: 'Block this course',
      onClick: () => setShowBlockModal(true)
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
      label: 'Report',
      onClick: () => setShowReportModal(true)
    }
  ]

  // Menu items for admin
  const adminMenuItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#f472b6' : 'none'} stroke={liked ? '#f472b6' : '#6b7280'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      label: liked ? 'Unlike' : 'Like',
      onClick: handleLikeToggle
    },
    // Delete or Restore based on status
    ...(course.status === 'deleted' ? [{
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path d="M4 12h16M12 4v16" />
        </svg>
      ),
      label: 'Restore',
      onClick: () => onAdminAction('restore', course.id),
      className: 'text-green-600 hover:bg-green-50'
    }] : [{
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
      label: 'Delete',
      onClick: () => onAdminAction('delete', course.id),
      className: 'text-red-600 hover:bg-red-50'
    }]),
    // Ban/Unban (chỉ hiện khi không bị deleted)
    ...(course.status !== 'deleted' ? [{
      icon: course.status === 'banned' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
      label: course.status === 'banned' ? 'Unban' : 'Ban',
      onClick: () => onAdminAction(course.status === 'banned' ? 'unban' : 'ban', course.id),
      className: course.state === 'ARCHIVED' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'
    }] : []),
    // Approve/Reject based on approvalStatus
    ...(course.state !== 'ARCHIVED' ? [{
      icon: course.approvalStatus === 'APPROVED' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: course.approvalStatus === 'APPROVED' ? 'Reject' : 'Approve',
      onClick: () => onAdminAction(course.approvalStatus === 'APPROVED' ? 'reject' : 'approve', course._id),
      className: course.approvalStatus === 'APPROVED' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
    }] : [])
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer relative">
        {/* Like Button */}
        <LikeButton liked={liked} onToggle={handleLikeToggle} />

        {/* Kebab Menu */}
        <KebabMenu items={menuItems} />

        {/* Approval Status Badge - Top Right */}
        {course.approvalStatus === 'APPROVED' && (
          <div className="absolute top-2 right-12 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Approved
          </div>
        )}

        {/* Course Content */}
        <div onClick={handleCardClick}>
          <div className={`h-32 ${getCourseColor(course.category)} flex items-center justify-center`}>
            <div className="text-white text-4xl">
              {getCourseIcon(course.image)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({course.reviews} reviews)</span>
              <span className="text-xs text-gray-500">• {course.students} students</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BlockCourseModal
        open={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlockConfirm}
      />
      <ReportCourseModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </>
  )
}

export default CourseCard