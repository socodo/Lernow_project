import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exploreService } from "../../service/courseService";
import {
  PlayIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [currentLesson, setCurrentLesson] = useState(1);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null); // Thêm state cho video URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await exploreService.getCourseContent(courseId);
        console.log("Fetched course content:", data);
        setCourse({
          id: data._id,
          title: data.title,
          instructor: data.creatorId?.fullName || "Unknown Instructor",
          rating: data.averageRating || 0,
          ratingCount: data.totalReviews || 0,
          students: data.totalEnrollments || 0,
          duration: data.totalDuration ? `${data.totalDuration} mins total` : "0 mins total",
          lastUpdated: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
          description: data.description,
          whatYouWillLearn: data.whatYouWillLearn || [],
          level: data.level,
          sections: data.sections.map(section => ({
            id: section._id,
            title: section.title,
            lessonsCount: section.lessonsCount,
            lessons: section.lessons.map(lesson => ({
              id: lesson._id,
              title: lesson.title,
              duration: "5min", // Placeholder as duration is not in Lesson model yet
              completed: false, // Placeholder for progress
              videoUrl: lesson.url,
              type: lesson.lessonType
            }))
          }))
        });

        // Initialize expanded sections
        const initialExpanded = {};
        if (data.sections) {
          data.sections.forEach(section => {
            initialExpanded[section._id] = true;
          });
        }
        setExpandedSections(initialExpanded);

      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen">Course not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white h-14 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-800 p-1 rounded"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="h-6 w-px bg-gray-700"></div>
          <h1 className="text-sm font-medium truncate max-w-md">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Your progress:</span>
            <span className="font-medium">0%</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content (Video + Tabs) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player Area */}
          <div className="bg-black w-full relative" style={{ height: '60vh', minHeight: '400px' }}>
            {currentVideoUrl ? (
              currentVideoUrl.includes('.mp4') || currentVideoUrl.includes('cloudinary') ? (
                <video
                  src={currentVideoUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <iframe
                  src={currentVideoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Video"
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                <div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                    <PlayIcon className="w-8 h-8 text-black ml-1" />
                  </div>
                  <p className="font-medium">Select a lesson to start learning</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex px-6 gap-8">
              {["Overview"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 max-w-4xl">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center text-yellow-500">
                      <span className="font-bold mr-1">{course.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                    <span>({course.ratingCount.toLocaleString()} ratings)</span>
                    <span>{course.students.toLocaleString()} students</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    For Beginners
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated: {course.lastUpdated}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">About this course</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-bold mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <div
                        className="font-bold text-sky-600 underline cursor-pointer"
                        onClick={() => navigate("/instructor/1")}
                      >
                        {course.instructor}
                      </div>
                      <div
                        className="text-sm text-gray-500 cursor-pointer hover:text-sky-600"
                        onClick={() => navigate("/instructor/1")}
                      >
                        View Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}





          </div>
        </div>

        {/* Sidebar (Course Content) */}
        <div className="w-96 border-l border-gray-200 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold">Course content</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 mb-2">
              0 / 15 lessons completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-sky-500 h-1 rounded-full w-0"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.sections.map((section) => (
              <div key={section.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-left"
                >
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {section.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {section.lessonsCount} lessons
                    </p>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {expandedSections[section.id] && (
                  <div className="bg-gray-50">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-100 ${currentLesson === lesson.id ? "bg-sky-50" : ""
                          }`}
                        onClick={() => {
                          setCurrentLesson(lesson.id);
                          setCurrentVideoUrl(lesson.videoUrl || null);
                        }}
                      > <div
                        className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${lesson.completed
                          ? "bg-sky-500 border-sky-500"
                          : "border-gray-400"
                          }`}
                      >
                          {lesson.completed && (
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm ${currentLesson === lesson.id
                              ? "text-sky-600 font-medium"
                              : "text-gray-700"
                              }`}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <PlayIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 text-center">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ml-auto hover:bg-gray-200">
              <QuestionMarkCircleIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
