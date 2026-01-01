import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";
import InstructorResources from "./components/InstructorResources";

const TutorNowPage = () => {
  const navigate = useNavigate();
  const handleCourseCreate = () => {
    navigate("/create-course");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Share Your Knowledge with the{" "}
            <span className="bg-gradient-to-r from-[#0EA5E9] to-blue-600 bg-clip-text text-transparent">
              World
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Create engaging online courses and inspire learners globally. Turn
            your expertise into impact and income.
          </p>

          <button
            onClick={handleCourseCreate}
            className="bg-gradient-to-r from-[#0EA5E9]  to-blue-400  text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            + Create New Course
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Teach on LearnOw?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-semibold text-xl mb-2">
              Reach Global Students
            </h3>
            <p className="text-gray-600">Connect with learners worldwide</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="font-semibold text-xl mb-2">Flexible Schedule</h3>
            <p className="text-gray-600">Teach on your own terms</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-semibold text-xl mb-2">Earn Income</h3>
            <p className="text-gray-600">Build sustainable revenue</p>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Get Started
          </h2>

          <div className="space-y-8 mb-20 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-[#0EA5E9] to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Plan Your Course</h3>
                <p className="text-gray-600">
                  Define your course objectives, target audience, and create an
                  outline of what you'll teach
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-[#0EA5E9] to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Create Your Content
                </h3>
                <p className="text-gray-600">
                  Record video lessons, prepare materials, and organize your
                  content into sections and lessons
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-[#0EA5E9] to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Publish & Promote
                </h3>
                <p className="text-gray-600">
                  Set your price, publish your course, and start reaching
                  students worldwide
                </p>
              </div>
            </div>
          </div>

          <InstructorResources />
        </div>
      </section>
    </div>
  );
};

export default TutorNowPage;
