import { useState, useEffect } from 'react'
import { adminCourseService, exploreService } from '../../service/courseService'
import useUserStore from '../../store/userStore'

const AdminCoursesPage = () => {
  const { user } = useUserStore()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // pending, all
  const [showActionModal, setShowActionModal] = useState(null)
  const [actionReason, setActionReason] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch courses based on active tab
  useEffect(() => {
    fetchCourses()
  }, [activeTab])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      let data = []

      if (activeTab === 'pending') {
        const response = await adminCourseService.getPendingCourses()
        data = response?.courses || []
      } else {
        // Get all courses (published & approved)
        const response = await exploreService.getAllCourses()
        data = response?.courses || []
      }

      console.log('Fetched courses in AdminCoursesPage:', data)
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (courseId) => {
    try {
      await adminCourseService.approveCourse(courseId, actionReason || 'Course approved')
      alert('Course approved successfully!')
      fetchCourses() // Refresh list
      setShowActionModal(null)
      setActionReason('')
    } catch (error) {
      console.error('Error approving course:', error)
      alert('Failed to approve course')
    }
  }

  const handleReject = async (courseId) => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      await adminCourseService.rejectCourse(courseId, actionReason)
      alert('Course rejected successfully!')
      fetchCourses() // Refresh list
      setShowActionModal(null)
      setActionReason('')
    } catch (error) {
      console.error('Error rejecting course:', error)
      alert('Failed to reject course')
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Map backend course data to display format
  const getStatusBadge = (course) => {
    const status = course.approvalStatus || course.state
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      PUBLISHED: 'bg-blue-100 text-blue-700',
      ARCHIVED: 'bg-gray-100 text-gray-600'
    }
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <p className="text-gray-600 mt-2">Review and approve courses</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'pending'
              ? 'bg-sky-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'all'
              ? 'bg-sky-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
          All Courses
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
        />
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-sky-500"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {activeTab === 'pending'
              ? 'No pending courses waiting for approval'
              : 'No courses available'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Approval</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{course.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {course.price?.amount === 0 ? 'Free' : `$${course.price?.amount || 0}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${course.approvalStatus === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                        course.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {course.approvalStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {course.approvalStatus === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowActionModal({ type: 'approve', courseId: course._id })}
                          className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setShowActionModal({ type: 'reject', courseId: course._id })}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {course.approvalStatus === 'APPROVED' && (
                      <span className="text-sm text-gray-500">Approved</span>
                    )}
                    {course.approvalStatus === 'REJECTED' && (
                      <span className="text-sm text-gray-500">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowActionModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 capitalize">
              {showActionModal.type} Course
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason {showActionModal.type === 'reject' && '*'}
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder={
                  showActionModal.type === 'approve'
                    ? "Optional: Add approval notes..."
                    : "Please provide a reason for rejection..."
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(null)
                  setActionReason('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showActionModal.type === 'approve') {
                    handleApprove(showActionModal.courseId)
                  } else {
                    handleReject(showActionModal.courseId)
                  }
                }}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${showActionModal.type === 'approve'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoursesPage
