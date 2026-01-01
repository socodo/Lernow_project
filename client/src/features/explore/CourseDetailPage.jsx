import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { exploreService } from "../../service/apiService";
import { enrollmentService } from "../../service/enrollmentService";
import {
  PlayIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TagIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // CRITICAL: Only show admin features if user exists AND role is 'admin'
  const isAdmin = user && user.role === "admin";

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [openSection, setOpenSection] = useState("introduction");

  // Check enrollment status
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (user && courseId) {
        try {
          const response = await enrollmentService.checkEnrollment(courseId);
          setIsEnrolled(response.isEnrolled);
        } catch (err) {
          console.error("Error checking enrollment:", err);
        }
      }
    };
    checkEnrollmentStatus();
  }, [user, courseId]);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await exploreService.getCourseById(courseId);

        setCourseData(response);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching course detail:", err);
        // For demo purposes, if fetch fails, we'll use mock data
        // setError(err.response?.data?.message || 'Failed to load course')
        setCourseData({}); // Set empty object to trigger mock data defaults
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state - Commented out to allow mock data fallback
  /*
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }
  
  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }
  */

  // Check if course is accessible (not banned/deleted for regular users)
  // Only check if we have real data with state
  if (
    courseData &&
    courseData.state &&
    !isAdmin &&
    (courseData.state === "ARCHIVED" ||
      courseData.approvalStatus !== "APPROVED")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Available</h1>
          <p className="text-gray-600">
            This course is currently not available.
          </p>
        </div>
      </div>
    );
  }

  // Use courseData directly from API
  const course = {
    _id: courseData?._id || "mock-id",
    title: courseData?.title || "Complete Web Development Bootcamp 2025",
    description:
      courseData?.description ||
      "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
    thumbnailUrl: courseData?.thumbnailUrl || null,
    level: courseData?.level || "BEGINNER",
    price: courseData?.price || { amount: 0, currency: "VND" },
    averageRating: courseData?.averageRating || 0,
    totalReviews: courseData?.totalReviews || 0,
    totalEnrollments: courseData?.totalEnrollments || 0,
    totalLessons: courseData?.totalLessons || 0,
    totalDuration: courseData?.totalDuration || 0,
    whatYouWillLearn: courseData?.whatYouWillLearn || [],
    requirements: courseData?.requirements || [],
    whyChooseThisCourse:
      courseData?.whyChooseThisCourse ||
      "This comprehensive course covers everything you need to become a professional developer.",
    language: courseData?.language || "en",
    tags: courseData?.tags || [],
    creatorId: courseData?.creatorId || { fullName: "Unknown", _id: null },
    createdAt: courseData?.createdAt || null,
    updatedAt: courseData?.updatedAt || null,
  };

  const getDefaultImage = () => {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzNiODJmNiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
  };

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const formatPrice = (price) => {
    if (!price || price.amount === 0) return "Free";
    return `${price.amount.toLocaleString()} ${price.currency}`;
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${courseId}`);
      return;
    }

    try {
      setIsEnrolling(true);
      await enrollmentService.enrollCourse(courseId);
      setIsEnrolled(true);
      navigate(`/learn/${courseId}`);
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll in course. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="inline-block bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded mb-4 uppercase">
                {course.level}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-gray-300 mb-6 line-clamp-2">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(course.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-300">
                    ({course.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold">
                    {course.totalEnrollments.toLocaleString()}
                  </span>
                  <span>students</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <span>Created by</span>
                  <span
                    className="text-blue-300 underline cursor-pointer"
                    onClick={() => navigate("/instructor/1")}
                  >
                    {course.creatorId?.fullName || "Dr. Sarah Chen"}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>
                    {course.language === "en" ? "English" : course.language}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {[
                  "Overview",
                  "Curriculum",
                  `Reviews (${course.totalReviews})`,
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(tab.split(" ")[0].toLowerCase())
                    }
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.split(" ")[0].toLowerCase()
                      ? "border-sky-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* About This Course */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {course.description}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Why Choose This Course?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {course.whyChooseThisCourse ||
                  "This comprehensive course covers everything you need to become a professional web developer. With hands-on projects and expert instruction, you'll gain practical skills that employers look for."}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.whatYouWillLearn.length > 0
                  ? course.whatYouWillLearn
                  : [
                    "Build responsive websites with HTML5 and CSS3",
                    "Master JavaScript and ES6+",
                    "Create dynamic web apps with React",
                    "Build backend APIs with Node.js and Express",
                    "Work with databases (MongoDB, PostgreSQL)",
                    "Deploy applications to the cloud",
                  ]
                ).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(course.requirements.length > 0
                  ? course.requirements
                  : [
                    "Basic computer skills",
                    "No programming experience needed",
                    "A computer with internet access",
                  ]
                ).map((req, index) => (
                  <li key={index} className="pl-2">
                    <span className="-ml-2">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Course Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GlobeAltIcon className="w-5 h-5" />
                    <span>Language:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {course.language === "en" ? "English" : course.language === "vi" ? "Vietnamese" : course.language}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChartBarIcon className="w-5 h-5" />
                    <span>Level:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="w-5 h-5" />
                    <span>Duration:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {course.totalDuration ? `${course.totalDuration} hours` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Lessons:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {course.totalLessons || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-gray-600">
                <DocumentTextIcon className="w-5 h-5" />
                <span>Lessons:</span>
              </div>
              <span className="font-medium text-gray-900">
                {course.lessonsCount} lessons
              </span>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Instructor
              </h2>
              <div className="flex gap-6">
                <div
                  className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl flex-shrink-0 text-white font-bold cursor-pointer"
                  onClick={() => navigate("/instructor/1")}
                >
                  {(course.creatorId?.fullName || "S").charAt(0)}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl font-semibold text-sky-600 mb-1 cursor-pointer hover:underline"
                    onClick={() => navigate("/instructor/1")}
                  >
                    {course.creatorId?.fullName || "Dr. Sarah Chen"}
                  </h3>
                  <p className="text-gray-600 mb-3">Expert Instructor</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Industry professional with years of experience teaching
                    students worldwide.
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {course.averageRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Rating
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {course.totalEnrollments.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">8</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {(course.tags.length > 0
                  ? course.tags
                  : [
                    "Web Development",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "Full Stack",
                  ]
                ).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Refund Policy */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Refund Policy
              </h2>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee. If you're not satisfied
                with the course for any reason, you can request a full refund
                within 30 days of purchase. No questions asked.
              </p>
            </div>
          </div>

          {/* Right Sidebar - Floating Card */}
          <div className="lg:col-span-1 relative">
            <div className="top-8 -mt-64 z-10">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                {/* Video Preview / Thumbnail */}
                <div className="relative aspect-video bg-black group cursor-pointer">
                  <img
                    src={course.thumbnailUrl || getDefaultImage()}
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = getDefaultImage();
                    }}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayIcon className="w-8 h-8 text-black ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    {course.totalLessons || 0} lessons • {course.totalDuration || 0} hours
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={`w-full py-3 rounded-lg font-bold mb-6 transition-colors ${isEnrolled
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-sky-500 hover:bg-sky-600 text-white"
                      } ${isEnrolling ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isEnrolling
                      ? "Enrolling..."
                      : isEnrolled
                        ? "Go to Course"
                        : "Enroll Now"}
                  </button>

                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="font-bold text-gray-900">
                      This course includes:
                    </p>
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-gray-400" />
                      <span>{course.totalDuration || 0} hours on-demand video</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <span>{course.totalLessons || 0} lessons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ChartBarIcon className="w-5 h-5 text-gray-400" />
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor Card (Sidebar) */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 cursor-pointer"
                    onClick={() => navigate("/instructor/1")}
                  >
                    {(course.creatorId?.fullName || "S").charAt(0)}
                  </div>
                  <div>
                    <div
                      className="font-bold text-sky-600 underline cursor-pointer mb-1"
                      onClick={() => navigate("/instructor/1")}
                    >
                      {course.creatorId?.fullName || "Dr. Sarah Chen"}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Expert Instructor
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3">
                      Industry professional with years of experience teaching
                      students worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
