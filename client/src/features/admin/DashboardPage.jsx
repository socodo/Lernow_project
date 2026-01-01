import { useAppData } from '../../shared/contexts/AppDataContext'
import { useAdmin } from './AdminContext'

const DashboardPage = () => {
  const { users, getStatistics } = useAppData()
  const { courses, coursesLoading } = useAdmin()
  const statistics = getStatistics()

  // Calculate active courses (APPROVED status)
  const activeCourses = courses.filter(course => course.approvalStatus === 'APPROVED')
  const totalUsers = users.length
  const activeCoursesCount = activeCourses.length
  
  // Calculate total enrollments from all approved courses
  const totalEnrollments = activeCourses.reduce((sum, course) => {
    return sum + (course.totalEnrollments || 0)
  }, 0)
  
  // Calculate total revenue from all approved courses
  const totalRevenue = activeCourses.reduce((sum, course) => {
    const enrollments = course.totalEnrollments || 0
    const price = course.price?.amount || 0
    return sum + (enrollments * price)
  }, 0)

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5% from last month',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: `${statistics.users.banned} banned`,
      changeType: statistics.users.banned > 0 ? 'decrease' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Courses',
      value: activeCoursesCount.toString(),
      change: 'Use Courses page to manage',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Course Enrollments',
      value: totalEnrollments.toLocaleString(),
      change: '+23.1% from last month',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ]

  // Get recent courses (approved courses, sorted by createdAt descending for newest first)
  const recentCourses = [...activeCourses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
    .slice(0, 5) // Top 5
    .map(course => {
      const enrollments = course.totalEnrollments || 0
      const price = course.price?.amount || 0
      const courseRevenue = enrollments * price
      
      return {
        id: course._id,
        title: course.title,
        instructor: course.creatorId?.name || 'Unknown', // TODO: Need to populate creator info from backend
        students: enrollments,
        status: course.approvalStatus,
        revenue: courseRevenue
      }
    })

  // Get recent users (sorted by join date, newest first)
  const recentUsers = [...users]
    .sort((a, b) => {
      // Parse date strings (format: "Jan 15, 2024" or "Feb 10, 2024")
      const dateA = new Date(a.joinDate)
      const dateB = new Date(b.joinDate)
      return dateB - dateA // Descending order (newest first)
    })
    .slice(0, 5) // Top 5
    .map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      enrollments: user.enrollments,
      joinDate: user.joinDate
    }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with LearnOw today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm mt-2 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
          <p className="text-sm text-gray-600 mt-1">Go to Courses page to manage courses</p>
        </div>
        {coursesLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-sky-500"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : recentCourses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved courses yet</h3>
            <p className="text-gray-600 mb-4">Course management has been moved to the Courses page</p>
            <a
              href="/admin/mode/courses"
              className="inline-block px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Go to Courses
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.students.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        APPROVED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${course.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <p className="text-sm text-gray-600 mt-1">Newly registered users on the platform</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'INSTRUCTOR' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.enrollments}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
