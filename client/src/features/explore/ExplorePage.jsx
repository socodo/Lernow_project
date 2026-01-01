import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useCoursesStore from "@/store/coursesStore";
import useUserStore from "@/store/userStore";
import { adminService } from "@/service/apiService";
import CourseActionMenu from "./components/CourseActionMenu";
import ApprovalModal from "./components/ApprovalModal";
import RejectionModal from "./components/RejectionModal";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const getDefaultImage = () => {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzNiODJmNiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
};

const handleImageError = (e) => {
  e.target.src = getDefaultImage();
};

const LEVEL_STYLES = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
};

const getLevelStyles = (level) => {
  return LEVEL_STYLES[level] || LEVEL_STYLES["BEGINNER"];
};

const ExplorePage = () => {
  const navigate = useNavigate();
  const {
    courses,
    isLoading,
    error,
    fetchAllCourses,
    setCourses,
    setIsLoading,
    setError,
  } = useCoursesStore();
  const { user } = useUserStore();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  useEffect(() => {
    const fetchCourses = async () => {
      if (isAdmin) {
        // Admin: fetch both pending and approved courses
        try {
          setIsLoading(true);
          setError(null);

          // Fetch pending courses
          const pendingResponse = await adminService.getPendingCourses();
          const pendingCourses = pendingResponse?.courses || [];

          // Fetch approved/public courses
          await fetchAllCourses();
          const approvedCourses = useCoursesStore.getState().courses || [];

          // Combine: pending first, then approved
          const allCourses = [
            ...pendingCourses.map((c) => ({ ...c, isPending: true })),
            ...approvedCourses.filter((c) => c.approvalStatus !== "PENDING"),
          ];

          setCourses(allCourses);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching admin courses:", err);
          setError(err.message || "Failed to load courses");
          setIsLoading(false);
        }
      } else {
        // Regular user: only fetch approved courses
        fetchAllCourses();
      }
    };

    fetchCourses();
  }, [isAdmin, fetchAllCourses, setCourses, setIsLoading, setError]);

  // Handle approve course
  const handleApprove = (course) => {
    setSelectedCourse(course);
    setShowApprovalModal(true);
    setActionError(null);
    setActionSuccess(null);
  };

  // Handle reject course
  const handleReject = (course) => {
    setSelectedCourse(course);
    setShowRejectionModal(true);
    setActionError(null);
    setActionSuccess(null);
  };

  // Confirm approval
  const confirmApproval = async (courseId, reason) => {
    try {
      await adminService.approveCourse(courseId, reason);
      setActionSuccess("Course approved successfully!");
      setShowApprovalModal(false);

      // Remove the approved course from the list or refetch
      const updatedCourses = courses.filter(
        (c) => (c._id || c.id) !== courseId
      );
      setCourses(updatedCourses);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Error approving course:", err);
      setActionError(err.response?.data?.message || "Failed to approve course");
    }
  };

  // Confirm rejection
  const confirmRejection = async (courseId, reason) => {
    try {
      await adminService.rejectCourse(courseId, reason);
      setActionSuccess("Course rejected successfully!");
      setShowRejectionModal(false);

      // Remove the rejected course from the list
      const updatedCourses = courses.filter(
        (c) => (c._id || c.id) !== courseId
      );
      setCourses(updatedCourses);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Error rejecting course:", err);
      setActionError(err.response?.data?.message || "Failed to reject course");
    }
  };

  // Cancel modals
  const cancelModal = () => {
    setShowApprovalModal(false);
    setShowRejectionModal(false);
    setSelectedCourse(null);
    setActionError(null);
  };

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "All Levels" ||
      course.level === selectedLevel.toUpperCase();

    return matchesSearch && matchesLevel;
  });

  const hasCourses = filteredCourses.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Explore Courses
          </h1>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Level Filter */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md appearance-none bg-white cursor-pointer"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Action Success/Error Messages */}
          {actionSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              {actionSuccess}
            </div>
          )}
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {actionError}
            </div>
          )}

          {/* Course Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!hasCourses ? (
                <div className="col-span-full text-center py-20 text-gray-500">
                  <p className="text-lg">
                    No courses found matching your criteria
                  </p>
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div
                    key={course._id || course.id}
                    onClick={() =>
                      navigate(`/course/${course._id || course.id}`)
                    }
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer relative"
                  >
                    {/* Action Menu for Admin on Pending Courses */}
                    {isAdmin && course.isPending && (
                      <CourseActionMenu
                        course={course}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    )}

                    {/* Pending Badge for Admin */}
                    {isAdmin && course.isPending && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          PENDING
                        </span>
                      </div>
                    )}

                    {/* Course Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={course.thumbnailUrl || getDefaultImage()}
                        alt={course.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                      {/* Level Badge on Image */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded uppercase ${course.level === "BEGINNER"
                            ? "bg-sky-500 text-white"
                            : course.level === "INTERMEDIATE"
                              ? "bg-sky-600 text-white"
                              : "bg-sky-700 text-white"
                            }`}
                        >
                          {course.level || "BEGINNER"}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                          {/* Placeholder avatar if no image */}
                          <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 text-xs font-bold">
                            {(
                              course.creatorId?.fullName ||
                              course.instructor?.name ||
                              "U"
                            ).charAt(0)}
                          </div>
                        </div>
                        <p className="text-xs text-red-500">
                          {course.creatorId?.fullName ||
                            "Unknown Instructor"}
                        </p>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-[3em]">
                        {course.title}
                      </h3>

                      {/* Course Description */}
                      {course.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-[2.5em]">
                          {course.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 font-bold text-sm">
                            {course.averageRating.toFixed(1) || "4.8"}
                          </span>
                          <span>({course.totalReviews || 2543})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.358-.442 3 3 0 00-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.025.654zM9 12a4 4 0 11-8 0 4 4 0 018 0zM19 12a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{course.
                            totalEnrollments
                          }</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{course.totalDuration || ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end border-t border-gray-100 pt-3">
                        <span className="text-xs text-gray-500">
                          {course.totalLessons || 245} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showApprovalModal && selectedCourse && (
        <ApprovalModal
          course={selectedCourse}
          onConfirm={confirmApproval}
          onCancel={cancelModal}
        />
      )}

      {showRejectionModal && selectedCourse && (
        <RejectionModal
          course={selectedCourse}
          onConfirm={confirmRejection}
          onCancel={cancelModal}
        />
      )}
    </div>
  );
};

export default ExplorePage;
