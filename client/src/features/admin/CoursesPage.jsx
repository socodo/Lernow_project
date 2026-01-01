import { useState } from 'react'
import { useAppData } from '../../shared/contexts/AppDataContext'

const CoursesPage = () => {
  const { courses, updateCourse, deleteCourse, restoreCourse, banCourse, unbanCourse, verifyCourse, rejectCourse } = useAppData()
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [actionType, setActionType] = useState('') // 'ban', 'delete', 'verify', 'reject'
  const [actionReason, setActionReason] = useState('')

  const [editForm, setEditForm] = useState({
    title: '',
    level: '',
    status: ''
  })

  const handleEditClick = (course) => {
    setSelectedCourse(course)
    setEditForm({
      title: course.title,
      level: course.level || 'Beginner',
      status: course.status
    })
    setShowEditModal(true)
    setActiveDropdown(null)
  }

  const handleActionClick = (course, type) => {
    setSelectedCourse(course)
    setActionType(type)
    setActionReason('')
    
    // Actions that need confirmation with reason
    if (type === 'ban' || type === 'delete' || type === 'reject') {
      setShowActionModal(true)
    } else {
      // Direct actions without reason
      performAction(course, type, '')
    }
    setActiveDropdown(null)
  }

  const performAction = (course, type, reason) => {
    switch (type) {
      case 'delete':
        deleteCourse(course.id, reason)
        break
      case 'restore':
        restoreCourse(course.id)
        break
      case 'ban':
        banCourse(course.id, reason)
        break
      case 'unban':
        unbanCourse(course.id)
        break
      case 'verify':
        verifyCourse(course.id)
        break
      case 'reject':
        rejectCourse(course.id, reason)
        break
      default:
        break
    }
  }

  const handleSaveEdit = () => {
    updateCourse(selectedCourse.id, editForm)
    setShowEditModal(false)
  }

  const handleConfirmAction = () => {
    if ((actionType === 'ban' || actionType === 'delete' || actionType === 'reject') && !actionReason.trim()) {
      alert('Please provide a reason')
      return
    }
    performAction(selectedCourse, actionType, actionReason)
    setShowActionModal(false)
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
        <p className="text-gray-600 mt-1">Manage all courses, approve or reject submissions, and edit course details</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Courses ({filteredCourses.length})</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage all courses on the platform</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => {
                // Parse students count
                const studentCount = typeof course.students === 'string' 
                  ? parseInt(course.students.replace(/[K,]/g, '')) * (course.students.includes('K') ? 1000 : 1)
                  : course.students || 0
                
                // Format price
                const priceDisplay = course.price === 0 || course.price === '0' 
                  ? 'Free' 
                  : `${course.price.toLocaleString()} $USD`
                
                return (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium text-gray-900 bg-gray-100 rounded-full uppercase">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{priceDisplay}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{studentCount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${
                        course.status === 'active' ? 'text-green-700 bg-green-100' :
                        course.status === 'banned' ? 'text-orange-700 bg-orange-100' :
                        course.status === 'deleted' ? 'text-red-700 bg-red-100' :
                        'text-gray-700 bg-gray-100'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${
                        course.approvalStatus === 'APPROVED' 
                          ? 'text-blue-700 bg-blue-100' 
                          : course.approvalStatus === 'REJECTED'
                          ? 'text-red-700 bg-red-100'
                          : 'text-yellow-700 bg-yellow-100'
                      }`}>
                        {course.approvalStatus === 'APPROVED' 
                          ? 'VERIFIED' 
                          : course.approvalStatus === 'REJECTED'
                          ? 'REJECTED'
                          : 'PENDING'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {activeDropdown === course.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Course
                          </button>
                          
                          {/* Verify/Reject - logic mới cho PENDING courses */}
                          {course.status !== 'deleted' && (
                            <>
                              {course.approvalStatus === 'PENDING' ? (
                                // Nếu đang PENDING, hiện CẢ 2 nút: Verify và Reject
                                <>
                                  <button
                                    onClick={() => handleActionClick(course, 'verify')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify Course
                                  </button>
                                  <button
                                    onClick={() => handleActionClick(course, 'reject')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Reject Course
                                  </button>
                                </>
                              ) : course.approvalStatus === 'APPROVED' ? (
                                // Nếu đã APPROVED, chỉ hiện Unverify (để revert về PENDING)
                                <button
                                  onClick={() => handleActionClick(course, 'reject')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                >
                                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Unverify Course
                                </button>
                              ) : (
                                // Nếu đã REJECTED, có thể cho verify lại
                                <button
                                  onClick={() => handleActionClick(course, 'verify')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Verify Course
                                </button>
                              )}
                            </>
                          )}

                          {/* Ban/Unban - chỉ hiện khi không bị deleted */}
                          {course.status === 'banned' ? (
                            <button
                              onClick={() => handleActionClick(course, 'unban')}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Unban Course
                            </button>
                          ) : course.status !== 'deleted' && (
                            <button
                              onClick={() => handleActionClick(course, 'ban')}
                              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Ban Course
                            </button>
                          )}

                          {/* Delete/Restore */}
                          {course.status === 'deleted' ? (
                            <button
                              onClick={() => handleActionClick(course, 'restore')}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore Course
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActionClick(course, 'delete')}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Course
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Course</h3>
                <p className="text-sm text-gray-600 mt-1">Update course details for &quot;{selectedCourse?.title}&quot;</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Course Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Level</label>
                <select
                  value={editForm.level}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Ban/Delete/Reject) */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionType === 'ban' ? 'Ban Course' :
                   actionType === 'delete' ? 'Delete Course' :
                   actionType === 'reject' ? 'Unverify Course' : 'Action Required'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {actionType === 'delete' ? 'This action cannot be undone. ' : ''}
                  Please provide a reason for {actionType}ing &quot;{selectedCourse?.title}&quot;
                </p>
              </div>
              <button onClick={() => setShowActionModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason (Required, Max 200 characters)
              </label>
              <textarea
                rows={4}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                maxLength={200}
                placeholder={`Explain why this course is being ${actionType}ed...`}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">{actionReason.length}/200 characters</p>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={!actionReason.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'ban' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {actionType === 'ban' ? 'Ban' :
                 actionType === 'delete' ? 'Delete' :
                 'Unverify'} Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
