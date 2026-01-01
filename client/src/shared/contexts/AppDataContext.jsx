import { createContext, useContext, useState, useEffect } from 'react'
import { adminService } from '../../service/apiService'

const AppDataContext = createContext(null)

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}

export const AppDataProvider = ({ children }) => {
  console.log('AppDataProvider mounted!') // ← Thêm log này
  
  // Load data from localStorage or use initial data
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)  // ← Thêm loading state
  const [error, setError] = useState(null)       // ← Thêm error state

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app-users')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=ef4444&color=fff',
        role: 'user',
        status: 'active', // active, banned
        balance: 50000,
        enrollments: 5,
        joinDate: 'Jan 15, 2024',
        enrolledCourses: [1, 2, 5]
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=3b82f6&color=fff',
        role: 'user',
        status: 'active',
        balance: 120000,
        enrollments: 8,
        joinDate: 'Feb 10, 2024',
        enrolledCourses: [1, 3, 4, 7]
      },
      {
        id: 3,
        name: 'Carol White',
        email: 'carol@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Carol+White&background=8b5cf6&color=fff',
        role: 'admin',
        status: 'active',
        balance: 0,
        enrollments: 0,
        joinDate: 'Nov 20, 2023',
        enrolledCourses: []
      },
      {
        id: 4,
        name: 'David Lee',
        email: 'david@example.com',
        avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=f59e0b&color=fff',
        role: 'user',
        status: 'banned',
        balance: 25000,
        enrollments: 3,
        joinDate: 'Mar 5, 2024',
        enrolledCourses: [2, 6]
      },
      {
        id: 5,
        name: 'Emma Davis',
        email: 'emma@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=10b981&color=fff',
        role: 'user',
        status: 'active',
        balance: 75000,
        enrollments: 12,
        joinDate: 'Jan 28, 2024',
        enrolledCourses: [1, 3, 5, 8, 9, 11]
      }
    ]
  })

  const [forums, setForums] = useState(() => {
    const saved = localStorage.getItem('app-forums')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever data changes
  // Fetch pending courses - ONLY if user is admin AND has valid token
  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        // Check if user is admin before fetching
        const userStr = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')
        
        // ❌ Không có user HOẶC không có token → không fetch
        if (!userStr || !token) {
          setLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        
        // ❌ Không phải admin → không fetch
        if (user.role?.toLowerCase() !== 'admin') {
          setLoading(false)
          return
        }

        // ✅ Có user + có token + là admin → mới fetch
        setLoading(true)
        console.log('Fetching pending courses...') // for debugging
        const response = await adminService.getPendingCourses()
        console.log('Fetched courses:', response) // for debugging

        // Axios interceptor đã unwrap response.data rồi
        // Nên response trực tiếp là { total, courses }
        if (!response.courses || !Array.isArray(response.courses)) {
          console.error('Invalid response format:', response)
          setCourses([])
          setError('Invalid response format')
          return
        }

        const mappedCourses = response.courses.map(course => ({
        id: course._id,                    
        title: course.title,
        instructor: 'Unknown',  // Tạm thời hardcode, sau sẽ populate
        level: course.level || 'BEGINNER',
        price: course.price?.amount === 0 
          ? 'Free' 
          : `${course.price?.amount} ${course.price?.currency}`,
        students: course.totalEnrollments || 0,
        status: 'active',  // Tạm thời set active
        verified: course.approvalStatus === 'APPROVED',
        approvalStatus: course.approvalStatus,
        adminNotes: course.approvalReason || '',
        // Giữ thêm fields gốc nếu cần
        ...course
      }))
      console.log('Mapped courses:', mappedCourses)  // Debug log
      setCourses(mappedCourses)
      setError(null)
  
      }
      catch (error) {
        console.error('Error fetching pending courses:', error)
          setError("Failed to load courses.")
            setCourses([])
      }
      finally {
        setLoading(false)
      }
    }

    fetchPendingCourses()  // ← GỌI HÀM!
  }, [])  // ← THÊM DEPENDENCY ARRAY!

  useEffect(() => {
    localStorage.setItem('app-users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('app-forums', JSON.stringify(forums))
  }, [forums])

  // Course actions
  const updateCourse = (courseId, updates) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    ))
  }

  const deleteCourse = (courseId, reason) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: 'deleted', adminNotes: reason } 
        : course
    ))
  }

  const restoreCourse = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: 'active', adminNotes: '' } 
        : course
    ))
  }

  const banCourse = (courseId, reason) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: 'banned', adminNotes: reason } 
        : course
    ))
  }

  const unbanCourse = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: 'active', adminNotes: '' } 
        : course
    ))
  }

  const verifyCourse = async (courseId, reason = '') => {
    try{
      console.log(`Verifying course ${courseId} with reason: ${reason}`)
      await adminService.approveCourse(courseId, reason)

      console.log(`Course ${courseId} verified successfully in backend.`)
      
      setCourses(prev => prev.map(course =>
        course.id === courseId
          ? { 
              ...course, 
              verified: true,
              approvalStatus: 'APPROVED',
              adminNotes: reason,
              state: 'PUBLISHED'  // Backend sẽ set state = PUBLISHED
            }
          : course
      ))

      console.log(`Course ${courseId} updated successfully in state.`)
      alert(`Course ${courseId} has been verified successfully.`)
      return { success: true }
    }
    catch (error){
      alert(`Failed to verify course ${courseId}: ${error.message || 'unknown error'}`)
      return { success: false, error: error.message}
    }
  }

  const rejectCourse = async (courseId, reason = '') => {
    if (!reason || reason.trim() === '') {
      alert('Please provide a reason for rejection')
      return { success: false, error: 'Reason is required' }
    }

    try {
      console.log('Rejecting course:', courseId, 'Reason:', reason)
      
      // 1. Gọi API
      await adminService.rejectCourse(courseId, { reason })
      
      // 2. Update state sau khi thành công
      setCourses(prev => prev.map(course =>
        course.id === courseId
          ? { 
              ...course, 
              verified: false,
              approvalStatus: 'REJECTED',
              adminNotes: reason
            }
          : course
      ))
      
      console.log('Course rejected successfully!')
      alert('Course rejected successfully!')
      
      return { success: true }
    } catch (error) {
      console.error('Error rejecting course:', error)
      alert('Failed to reject course: ' + (error.message || 'Unknown error'))
      return { success: false, error: error.message }
    }
  }

  // Get active courses only (not deleted, not banned, and verified for users)
  const getActiveCourses = () => {
    return courses.filter(course => 
      course.status === 'active' && course.verified === true
    )
  }

  // Get all courses including banned/deleted (for admin)
  const getAllCourses = () => {
    return courses
  }

  // User actions
  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
  }

  const banUser = (userId, reason) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: 'banned', banReason: reason } 
        : user
    ))
  }

  const unbanUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: 'active', banReason: '' } 
        : user
    ))
  }

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  // Forum actions
  const addForum = (forum) => {
    setForums(prev => [...prev, { ...forum, id: Date.now() }])
  }

  const updateForum = (forumId, updates) => {
    setForums(prev => prev.map(forum => 
      forum.id === forumId ? { ...forum, ...updates } : forum
    ))
  }

  const deleteForum = (forumId) => {
    setForums(prev => prev.filter(forum => forum.id !== forumId))
  }

  // Review actions
  const deleteReview = (courseId, reviewId, reason) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId && course.studentReviews) {
        return {
          ...course,
          studentReviews: course.studentReviews.filter(review => review.id !== reviewId)
        }
      }
      return course
    }))
  }

  // Statistics for admin dashboard
  const getStatistics = () => {
    const totalCourses = courses.length
    const activeCourses = courses.filter(c => c.status === 'active').length
    const bannedCourses = courses.filter(c => c.status === 'banned').length
    const deletedCourses = courses.filter(c => c.status === 'deleted').length
    const verifiedCourses = courses.filter(c => c.verified).length

    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const bannedUsers = users.filter(u => u.status === 'banned').length

    const totalStudents = courses.reduce((sum, course) => {
      const studentCount = typeof course.students === 'string' 
        ? parseInt(course.students.replace(/[K,]/g, '')) * 1000
        : course.students
      return sum + (studentCount || 0)
    }, 0)

    const totalRevenue = users.reduce((sum, user) => sum + (user.balance || 0), 0)

    return {
      courses: {
        total: totalCourses,
        active: activeCourses,
        banned: bannedCourses,
        deleted: deletedCourses,
        verified: verifiedCourses
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        banned: bannedUsers
      },
      totalStudents,
      totalRevenue
    }
  }

  const value = {
    // Data
    courses,
    loading,
    error,
    users,
    forums,
    
    // Course actions
    updateCourse,
    deleteCourse,
    restoreCourse,
    banCourse,
    unbanCourse,
    verifyCourse,
    rejectCourse,
    getActiveCourses,
    getAllCourses,
    deleteReview,
    
    // User actions
    updateUser,
    banUser,
    unbanUser,
    deleteUser,
    
    // Forum actions
    addForum,
    updateForum,
    deleteForum,
    
    // Statistics
    getStatistics,
    
    // Direct setters (for advanced use)
    setCourses,
    setUsers,
    setForums
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
