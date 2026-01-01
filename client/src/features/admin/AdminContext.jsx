import { createContext, useContext, useState, useEffect } from 'react'
import { adminCourseService } from '../../service/courseService'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  // Fetch courses from API
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Check if user is logged in and is admin
        const userStr = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')
        
        if (!userStr || !token) {
          console.log('AdminContext - No user or token, skipping fetch')
          setCoursesLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        if (user.role?.toLowerCase() !== 'admin') {
          console.log('AdminContext - User is not admin, skipping fetch')
          setCoursesLoading(false)
          return
        }

        setCoursesLoading(true)
        const response = await adminCourseService.getAllCoursesForAdmin()
        setCourses(response?.courses || [])
      } catch (error) {
        console.error('AdminContext - Error fetching courses:', error)
        setCourses([])
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=ef4444&color=fff',
      role: 'USER',
      status: 'Active',
      balance: 50000,
      enrollments: 5,
      joinDate: 'Jan 15, 2024'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=3b82f6&color=fff',
      role: 'USER',
      status: 'Active',
      balance: 120000,
      enrollments: 8,
      joinDate: 'Feb 10, 2024'
    },
    {
      id: 3,
      name: 'Carol White',
      email: 'carol@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Carol+White&background=8b5cf6&color=fff',
      role: 'ADMIN',
      status: 'Active',
      balance: 0,
      enrollments: 0,
      joinDate: 'Nov 20, 2023'
    },
    {
      id: 4,
      name: 'David Lee',
      email: 'david@example.com',
      avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=f59e0b&color=fff',
      role: 'USER',
      status: 'Banned',
      balance: 25000,
      enrollments: 3,
      joinDate: 'Mar 5, 2024'
    },
    {
      id: 5,
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=10b981&color=fff',
      role: 'USER',
      status: 'Active',
      balance: 75000,
      enrollments: 12,
      joinDate: 'Jan 28, 2024'
    }
  ])

  const [forums, setForums] = useState([
    {
      id: 1,
      title: 'Difference between var, let, and const?',
      preview: "I'm still confused about when to use var vs let vs const in JavaScript. Can someon",
      content: "I'm still confused about when to use var vs let vs const in JavaScript. Can someone explain the differences and when to use each one? I've read the documentation but I'm still not clear on the practical use cases.",
      author: 'John Smith',
      authorAvatar: 'https://ui-avatars.com/api/?name=John+Smith&background=ef4444&color=fff',
      course: 'Complete Web Development Bootcamp 2025',
      views: 25,
      replies: 2,
      status: 'Pinned',
      date: 'Feb 10',
      isPinned: true,
      isLocked: false,
      answers: [
        {
          id: 1,
          author: 'Sarah Chen',
          authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8b5cf6&color=fff',
          content: 'Great question! Here\'s the breakdown:\n\n• var: Function-scoped, can be redeclared and updated. Avoid using it in modern JavaScript.\n• let: Block-scoped, can be updated but not redeclared.\n• const: Block-scoped, cannot be updated or redeclared. Use for values that won\'t change.\n\nBest practice: Use const by default, let when you need to reassign, and avoid var.',
          date: 'Feb 10',
          likes: 5
        },
        {
          id: 2,
          author: 'Mike Johnson',
          authorAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
          content: 'To add to Sarah\'s answer, const doesn\'t make objects immutable. You can still modify properties of const objects:\n\nconst obj = { name: "John" };\nobj.name = "Jane"; // This works!\nobj = {}; // This throws an error',
          date: 'Feb 10',
          likes: 3
        }
      ]
    },
    {
      id: 2,
      title: 'How to deploy React app to Vercel?',
      preview: "I've completed the React section and built my first app. What's the best way to de",
      content: "I've completed the React section and built my first app. What's the best way to deploy it to Vercel? Do I need to configure anything special?",
      author: 'Alex Thompson',
      authorAvatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=3b82f6&color=fff',
      course: 'Complete Web Development Bootcamp 2025',
      views: 12,
      replies: 2,
      status: 'Locked',
      date: 'Feb 11',
      isPinned: false,
      isLocked: true,
      answers: [
        {
          id: 1,
          author: 'Emily Rodriguez',
          authorAvatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
          content: 'Deploying to Vercel is super easy! Just:\n1. Push your code to GitHub\n2. Connect your GitHub repo to Vercel\n3. Vercel will auto-detect React and deploy\n\nNo special configuration needed for most React apps!',
          date: 'Feb 11',
          likes: 8
        }
      ]
    },
    {
      id: 3,
      title: 'Best practices for organizing React components?',
      preview: 'My React project is getting messy with too many components. What\'s the recomme',
      content: 'My React project is getting messy with too many components. What\'s the recommended folder structure for organizing React components in a large application?',
      author: 'Tom Wilson',
      authorAvatar: 'https://ui-avatars.com/api/?name=Tom+Wilson&background=10b981&color=fff',
      course: 'Complete Web Development Bootcamp 2025',
      views: 18,
      replies: 1,
      status: 'Active',
      date: 'Feb 9',
      isPinned: false,
      isLocked: false,
      answers: [
        {
          id: 1,
          author: 'David Park',
          authorAvatar: 'https://ui-avatars.com/api/?name=David+Park&background=06b6d4&color=fff',
          content: 'I recommend organizing by feature rather than by type. For example:\n\n/features\n  /auth\n    LoginForm.jsx\n    SignupForm.jsx\n  /dashboard\n    DashboardView.jsx\n    Stats.jsx\n\nThis keeps related components together and makes the codebase more maintainable.',
          date: 'Feb 9',
          likes: 4
        }
      ]
    }
  ])

  const value = {
    users,
    setUsers,
    courses,
    setCourses,
    coursesLoading,
    forums,
    setForums
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
