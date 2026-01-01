import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  LinkIcon,
  CalendarDaysIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const InstructorProfilePage = () => {
  const navigate = useNavigate();
  // Mock data based on screenshots
  const instructor = {
    name: "Dr. Sarah Chen",
    title: "Full-Stack Developer & Tech Educator",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Chen&background=random&size=200",
    about:
      "Dr. Sarah Chen is a seasoned full-stack developer with over 10 years of experience in web development. She holds a Ph.D. in Computer Science from Stanford University and has worked at leading tech companies including Google and Facebook. Sarah is passionate about making programming education accessible to everyone and has taught over 50,000 students worldwide.",
    expertise: [
      "Web Development",
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Cloud Architecture",
    ],
    memberSince: "January 2022",
    stats: [
      { label: "Total Students", value: "15,678" },
      { label: "Reviews", value: "2,543" },
      { label: "Total Courses", value: "8" },
      { label: "Overall Rating", value: "4.8" },
    ],
    courses: [
      {
        id: 1,
        title: "Complete Web Development Bootcamp 2025",
        description:
          "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more. Build real-world...",
        rating: 4.8,
        ratingCount: 2543,
        students: 15678,
        duration: "52h",
        lessons: 245,
        price: "1,999,000 VND",
        image: "https://placehold.co/600x400/png?text=Web+Dev",
        tag: "BEGINNER",
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah Miller",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Miller&background=random",
        rating: 5,
        date: "10/02/2024",
        verified: true,
        content:
          "This course has transformed my career. The courses are well-structured, and the tutors are incredibly supportive.",
      },
      {
        id: 2,
        user: "David Chen",
        avatar: "https://ui-avatars.com/api/?name=David+Chen&background=random",
        rating: 5,
        date: "08/02/2024",
        verified: true,
        content:
          "I love the flexibility of this platform. I can learn at my own pace, anytime, anywhere.",
      },
      {
        id: 3,
        user: "Emily Rodriguez",
        avatar:
          "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random",
        rating: 5,
        date: "05/02/2024",
        verified: true,
        content:
          "The hands-on exercises in the courses are fantastic. I've gained practical skills that I can apply immediately.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0ea5e9] h-64 w-full relative">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          {/* Content positioned absolutely to overlap */}
        </div>
      </div>

      {/* Profile Info Section (Overlapping Banner) */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name and Title (White text on blue bg) */}
          <div className="pt-4 md:pt-8 text-white flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{instructor.name}</h1>
                <p className="text-blue-100 text-lg">{instructor.title}</p>
              </div>

              {/* Stats Cards (White boxes) */}
              <div className="flex gap-4 mt-4 md:mt-0 translate-y-16 md:translate-y-0">
                {instructor.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm min-w-[120px] text-center hidden md:block"
                  >
                    <div className="font-bold text-gray-900 text-xl">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: About, Expertise, Connect */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {instructor.about}
              </p>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {instructor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Website
                    </div>
                    <div className="text-xs text-gray-500">Visit Website</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      LinkedIn
                    </div>
                    <div className="text-xs text-gray-500">View Profile</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Member since:</span>{" "}
                {instructor.memberSince}
              </div>
            </div>
          </div>

          {/* Right Column: Courses, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Courses by Dr.
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {instructor.stats[2].value} courses available
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {instructor.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {course.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {instructor.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center text-yellow-500 font-bold">
                          <StarIcon className="w-4 h-4 mr-1" />
                          {course.rating}{" "}
                          <span className="text-gray-400 font-normal ml-1">
                            ({course.ratingCount})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {course.students.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="font-bold text-gray-900">
                          {course.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.lessons} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What Students Say
              </h2>
              <div className="space-y-4">
                {instructor.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">
                            {review.user}
                          </h4>
                          {review.verified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckBadgeIcon className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfilePage;
