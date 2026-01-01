import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  Bars3Icon,
  PlayCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  UsersIcon,
  StarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  PhotoIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for Settings
  const [settings, setSettings] = useState({
    language: "English",
    level: "Intermediate",
    publicationState: "Published",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
  });

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // Mock data for Analytics
  const analyticsStats = [
    {
      label: "Total Students",
      value: "1,250",
      change: "+12% this month",
      icon: UsersIcon,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Average Rating",
      value: "4.8",
      subtext: "342 reviews",
      icon: StarIcon,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Completion Rate",
      value: "68%",
      change: "+5% this month",
      icon: ChartBarIcon,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  // Mock data for Overview
  const [overview, setOverview] = useState({
    title: "Complete React & TypeScript Course 2025",
    description:
      "Learn React 18+ and TypeScript from scratch with hands-on projects and real-world examples.",
    whyChoose:
      "This comprehensive course covers everything you need to master React and TypeScript development.",
    whatYouWillLearn: [
      "Build modern React applications",
      "Master TypeScript fundamentals",
      "Create reusable components",
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "Understanding of HTML and CSS",
    ],
    tags: ["React", "TypeScript", "Web Development", "Frontend"],
    refundPolicy: "30-day money-back guarantee. No questions asked.",
  });

  const handleOverviewChange = (field, value) => {
    setOverview((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (field, defaultValue = "") => {
    setOverview((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeListItem = (field, index) => {
    setOverview((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleListChange = (field, index, value) => {
    const newList = [...overview[field]];
    newList[index] = value;
    setOverview((prev) => ({ ...prev, [field]: newList }));
  };

  // Mock data based on screenshot
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section 1: Introduction to React",
      lessonsCount: 2,
      isOpen: true,
      lessons: [
        {
          id: 1,
          title: "What is React?",
          description: "Introduction to React library and its core concepts",
          duration: "10 min",
          type: "video",
        },
        {
          id: 2,
          title: "Setting Up Development Environment",
          description:
            "Install Node.js, VS Code, and create your first React app",
          duration: "15 min",
          type: "video",
        },
      ],
    },
    {
      id: 2,
      title: "Section 2: TypeScript Fundamentals",
      lessonsCount: 0,
      isOpen: false,
      lessons: [],
    },
  ]);

  const [editingSection, setEditingSection] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const toggleSection = (id) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const handleAddSection = () => {
    const newSectionId = sections.length + 1;
    const newSection = {
      id: newSectionId,
      title: `Section ${newSectionId}: New Section`,
      lessonsCount: 0,
      isOpen: true,
      lessons: [],
    };
    setSections([...sections, newSection]);
  };

  const handleAddLesson = (sectionId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: [
              ...section.lessons,
              {
                id: Date.now(),
                title: "New Lesson",
                description: "Lesson description",
                duration: "0 min",
                type: "video",
              },
            ],
            lessonsCount: section.lessonsCount + 1,
          };
        }
        return section;
      })
    );
  };

  const handleDeleteSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
            lessonsCount: section.lessonsCount - 1,
          };
        }
        return section;
      })
    );
  };

  const handleEditSection = (section) => {
    setEditingSection({ ...section });
  };

  const handleSaveSection = () => {
    setSections(
      sections.map((section) =>
        section.id === editingSection.id
          ? { ...section, title: editingSection.title }
          : section
      )
    );
    setEditingSection(null);
  };

  const handleEditLesson = (sectionId, lesson) => {
    setEditingLesson({ ...lesson, sectionId });
  };

  const handleSaveLesson = () => {
    setSections(
      sections.map((section) => {
        if (section.id === editingLesson.sectionId) {
          return {
            ...section,
            lessons: section.lessons.map((lesson) =>
              lesson.id === editingLesson.id
                ? {
                    ...lesson,
                    title: editingLesson.title,
                    description: editingLesson.description,
                    duration: editingLesson.duration,
                    type: editingLesson.type,
                    videoUrl: editingLesson.videoUrl,
                  }
                : lesson
            ),
          };
        }
        return section;
      })
    );
    setEditingLesson(null);
  };

  const handleSave = () => {
    // Logic to save changes would go here
    navigate("/my-courses");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Complete React & TypeScript Course 2025
                </h1>
                <p className="text-xs text-gray-500">Course Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                Published
              </span>
              <button
                onClick={handleSave}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-2">
            {["Overview", "Curriculum", "Settings", "Analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "Overview" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                )}
                {tab === "Curriculum" && <PlayCircleIcon className="w-4 h-4" />}
                {tab === "Settings" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
                {tab === "Analytics" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                )}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Course Information
            </h2>

            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={overview.title}
                  onChange={(e) =>
                    handleOverviewChange("title", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={overview.description}
                  onChange={(e) =>
                    handleOverviewChange("description", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Why Choose This Course */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Why Choose This Course?
                </label>
                <textarea
                  rows={3}
                  value={overview.whyChoose}
                  onChange={(e) =>
                    handleOverviewChange("whyChoose", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* What You'll Learn */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  What You'll Learn
                </label>
                <div className="space-y-3">
                  {overview.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleListChange(
                            "whatYouWillLearn",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <button
                        onClick={() =>
                          removeListItem("whatYouWillLearn", index)
                        }
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem("whatYouWillLearn")}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Learning Outcome
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Requirements
                </label>
                <div className="space-y-3">
                  {overview.requirements.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleListChange(
                            "requirements",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeListItem("requirements", index)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem("requirements")}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Requirement
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {overview.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {tag}
                      </span>
                      <button
                        onClick={() => removeListItem("tags", index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addListItem("tags", e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Refund Policy */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Refund Policy
                </label>
                <textarea
                  rows={2}
                  value={overview.refundPolicy}
                  onChange={(e) =>
                    handleOverviewChange("refundPolicy", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Course Curriculum
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  2 sections • 3 lessons • 45m total
                </p>
              </div>
              <button
                onClick={handleAddSection}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="text-gray-400">
                        <Bars3Icon className="w-5 h-5" />
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        {section.isOpen ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-medium text-gray-900">
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {section.lessonsCount} lessons
                      </span>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {section.isOpen && (
                    <div className="bg-white">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-4 border-t border-gray-100 flex items-start gap-4 hover:bg-gray-50 group"
                        >
                          <div className="text-gray-300 mt-1">
                            <Bars3Icon className="w-5 h-5" />
                          </div>
                          <div className="mt-1 text-sky-500">
                            <PlayCircleIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleEditLesson(section.id, lesson)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLesson(section.id, lesson.id)
                                }
                                className="text-red-400 hover:text-red-600"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Lesson Button */}
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={() => handleAddLesson(section.id)}
                          className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Course Settings
            </h2>

            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      handleSettingsChange("language", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option>English</option>
                    <option>Vietnamese</option>
                    <option>Spanish</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Course Level */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Course Level
                </label>
                <div className="relative">
                  <select
                    value={settings.level}
                    onChange={(e) =>
                      handleSettingsChange("level", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Publication State */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Publication State
                </label>
                <div className="relative">
                  <select
                    value={settings.publicationState}
                    onChange={(e) =>
                      handleSettingsChange("publicationState", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Published</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Thumbnail URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={settings.thumbnail}
                    onChange={(e) =>
                      handleSettingsChange("thumbnail", e.target.value)
                    }
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2">
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Upload
                  </button>
                </div>
                {settings.thumbnail && (
                  <div className="mt-4 w-64 h-36 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={settings.thumbnail}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </h3>
                      {stat.change && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {stat.change}
                        </p>
                      )}
                      {stat.subtext && (
                        <p className="text-xs text-gray-400 mt-1">
                          {stat.subtext}
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="text-gray-500 text-sm py-8">
                Analytics dashboard coming soon...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setEditingSection(null)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Section
                  </h3>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  onClick={handleSaveSection}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setEditingLesson(null)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Lesson
                  </h3>
                  <button
                    onClick={() => setEditingLesson(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={editingLesson.title}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingLesson.description}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <div className="relative">
                    <select
                      value={editingLesson.type}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm appearance-none bg-white"
                    >
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="text"
                    value={editingLesson.duration}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                {editingLesson.type === "video" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Embed URL
                    </label>
                    <input
                      type="text"
                      value={editingLesson.videoUrl || ""}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          videoUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCoursePage;
