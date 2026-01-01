import { useState, useEffect } from "react";
import instance from "../../service/axiosConfig";
import CoursesHeader from "./components/CoursesHeader";
import StatsCards from "./components/StatsCards";
import CoursesFilterBar from "./components/CoursesFilterBar";
import CourseList from "./components/CourseList";

// Trang chính cho My Courses (dành cho giảng viên / creator)
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    sort: "newest",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // instance từ axiosConfig đã có interceptor tự thêm token và return response.data
        const data = await instance.get("/courses/manage", {
          params: filters,
        });
        console.log("Courses data:", data);
        setCourses(data.courses || []);
        setStatistics(data.statistics);
      } catch (error) {
        console.error("Error fetching courses:", error);
        console.error("Error response:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [filters]);

  const handleDeleteCourse = async (courseId) => {
    try {
      await instance.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      // Update statistics if needed, or refetch
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CoursesHeader />

        <div className="mt-6 space-y-6">
          <StatsCards statistics={statistics} />
          <CoursesFilterBar filters={filters} onFilterChange={setFilters} />
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <CourseList courses={courses} onDeleteCourse={handleDeleteCourse} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
