import { Route, Routes, Navigate, useLocation } from "react-router-dom";

// Layouts
import MainLayout from "../../shared/layouts/MainLayout";
import AdminLayout from "../../shared/layouts/AdminLayout";

// Store
import useUserStore from "../../store/userStore";
import LoginPage from "../../features/auth/LoginPage";
import RegisterPage from "../../features/auth/Register";

// Main Pages
import HomePage from "../../features/home/HomePage";
import ExplorePage from "../../features/explore/ExplorePage";
import CourseDetailPage from "../../features/explore/CourseDetailPage";
import TutorNowPage from "../../features/tutornow/TutorNowPage";
import CreateCoursePage from "../../features/CreateCourse/CreateCoursePage";
import ProfilePage from "../../features/profile/ProfilePage";
import EnrollmentsPage from "../../features/enrollments/EnrollmentsPage";
import CoursePlayerPage from "../../features/enrollments/CoursePlayerPage";
import MyCoursesPage from "../../features/courses/CoursesPage";
import EditCoursePage from "../../features/courses/EditCoursePage";
import UserSettingsPage from "../../features/settings/SettingsPage";
import InstructorProfilePage from "../../features/profile/InstructorProfilePage";

// Admin Pages
import DashboardPage from "../../features/admin/DashboardPage";
import AdminCoursesPage from "../../features/admin/AdminCoursesPage";
import UsersPage from "../../features/admin/UsersPage";
import SettingsPage from "../../features/admin/SettingsPage";

/**
 * Thành phần này yêu cầu người dùng phải đăng nhập
 * để truy cập các tuyến đường (route) được bọc bên trong nó.
 */
const RequireAuth = ({ children }) => {
  const { user, loading, accessToken, isAuthenticated } = useUserStore();
  const location = useLocation();


  // Đang loading -> chờ
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-sky-500"></div>
      </div>
    );
  }

  // Có accessToken nhưng chưa có user -> đang fetch, chờ
  if (isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    // Chuyển hướng người dùng đến trang đăng nhập
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

/**
 * Component bảo vệ route chỉ dành cho Admin
 */
const RequireAdmin = ({ children }) => {
  const { user, loading, accessToken } = useUserStore();
  const location = useLocation();

  console.log("RequireAdmin - user:", user, "role:", user?.role);

  // Đang loading -> chờ
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-sky-500"></div>
      </div>
    );
  }

  // Có accessToken nhưng chưa có user -> đang fetch, chờ
  if (accessToken && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    // Chưa đăng nhập -> chuyển đến login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role (case-insensitive)
  const userRole = user.role?.toLowerCase();
  if (userRole !== "admin") {
    // Đã đăng nhập nhưng không phải admin -> về home
    console.log("RequireAdmin - User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Nơi định nghĩa tất cả các tuyến đường (route) của ứng dụng
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Course Player - Full Screen */}
      <Route
        path="/learn/:courseId"
        element={
          <RequireAuth>
            <CoursePlayerPage />
          </RequireAuth>
        }
      />

      {/* Tuyến đường công khai dùng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="course/:courseId" element={<CourseDetailPage />} />
        <Route path="instructor/:id" element={<InstructorProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Tuyến đường riêng tư - Yêu cầu đăng nhập */}
        <Route
          path="tutor-now"
          element={
            <RequireAuth>
              <TutorNowPage />
            </RequireAuth>
          }
        />
        <Route
          path="create-course"
          element={
            <RequireAuth>
              <CreateCoursePage />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="enrollments"
          element={
            <RequireAuth>
              <EnrollmentsPage />
            </RequireAuth>
          }
        />
        <Route
          path="my-courses"
          element={
            <RequireAuth>
              <MyCoursesPage />
            </RequireAuth>
          }
        />
        <Route
          path="instructor/courses/:courseId/edit"
          element={
            <RequireAuth>
              <EditCoursePage />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth>
              <UserSettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth>
              <UserSettingsPage />
            </RequireAuth>
          }
        />
      </Route>

      {/* Tuyến đường Admin - Chỉ admin mới vào được */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <MainLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
        <Route path="settings" element={<UserSettingsPage />} />
      </Route>

      {/* Tuyến đường Bảng điều khiển Admin - Chỉ admin mới vào được */}
      <Route
        path="/admin/mode"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

/**
 * Thành phần AppRouter chính
 */
const AppRouter = () => {
  return <AppRoutes />;
};

export default AppRouter;
