import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";

// CoursesHeader: title and subtitle for My Created Courses
const CoursesHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">My Created Courses</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage and track your course creations
        </p>
      </div>
      <button
        onClick={() => navigate("/create-course")}
        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        Create New Course
      </button>
    </div>
  );
};

export default CoursesHeader;
